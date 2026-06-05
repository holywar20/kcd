'use strict'

/**
 * flush.js — declarative teardown for a KCD deployment (the "flush" of flush-and-fill).
 *
 * Deletes ONLY the folders/files indicated in the deployment canvas — a delete whitelist.
 * Anything not on the canvas is ignored; kcd is never deleted (hard guard, below). Missing
 * paths are skipped without drama. The point is to get a deployment back to baseline with
 * zero ceremony so the deploy step can refill it.
 *
 * The whitelist is read straight from the canvas, so it tracks the locked schema — change
 * the canvas, the whitelist changes with it. If the canvas can't be read, flush stops
 * rather than guess at deletions.
 *
 * Application-layer tooling — folds into Starmind later. NOT a kcd artifact (no frontmatter,
 * no lens, never registered as a utility). We're building kcd without kcd.
 *
 *   node flush.js                         inspect the default project (no changes)
 *   node flush.js --delete                flush the default project
 *   node flush.js --target <path>         inspect another deployment
 *   node flush.js --target <path> --delete
 */

const fs = require( 'fs' )
const path = require( 'path' )
const canvasLib = require( './canvas' )

// Anchor on the kcd root by walking up from this script — robust to where the scripts are
// filed (their canonical home is still TBD). Stops at the dir holding the deployment canvas.
function findKcdRoot( start ) {
	let dir = start
	for( let i = 0; i < 8; i++ ) {
		if( fs.existsSync( path.join( dir, 'docs', 'deployment_schema.canvas' ) ) ) return dir
		const up = path.dirname( dir )
		if( up === dir ) break
		dir = up
	}
	throw new Error( `could not locate the kcd root (no docs/deployment_schema.canvas above ${start})` )
}
const KCD_ROOT = findKcdRoot( __dirname )                    // .../_Claude/kcd
const CANVAS_PATH = path.join( KCD_ROOT, 'docs', 'deployment_schema.canvas' )
const PROJECT_ROOT = path.resolve( KCD_ROOT, '..', '..' )    // default target: project root (parent of _Claude)
const CLAUDE_DIR = '_Claude'
const NEVER_DELETE = new Set( [ 'kcd' ] )                      // hard guard, independent of the canvas

// ---- args ----------------------------------------------------------------
function parseArgs( argv ) {
	const a = { target: PROJECT_ROOT, delete: false }
	for( let i = 0; i < argv.length; i++ ) {
		const t = argv[ i ]
		if( t === '--target' || t === '-t' ) a.target = argv[ ++i ]
		else if( t === '--delete' || t === '--force' || t === '-d' ) a.delete = true
		else if( t && !t.startsWith( '-' ) ) a.target = t         // positional target
	}
	a.target = path.resolve( a.target )
	return a
}

// ---- helpers -------------------------------------------------------------
const exists = ( p ) => fs.existsSync( p )

function folderTag( p ) {
	try {
		const s = fs.statSync( p )
		if( s.isDirectory() ) {
			const n = fs.readdirSync( p ).length
			return n ? ` (${n} item${n === 1 ? '' : 's'})` : ' (empty)'
		}
	} catch{ /* ignore */ }
	return ''
}

// ---- whitelist (from the canvas) -----------------------------------------
// root files  = file-shaped children of "Project Root"  (e.g. CLAUDE.md)
// _Claude dirs = children of "_Claude", minus kcd / placeholders
function buildWhitelist( canvasPath = CANVAS_PATH ) {
	const canvas = canvasLib.load( canvasPath )               // throws -> caller stops
	const root = canvasLib.findByText( canvas, 'Project Root' )
	const claude = canvasLib.findByText( canvas, CLAUDE_DIR )
	if( !root || !claude ) throw new Error( 'canvas missing a "Project Root" or "_Claude" node' )

	const rootFiles = canvasLib.childrenOf( canvas, root.id )
		.filter( ( n ) => canvasLib.isFile( n ) && !canvasLib.isPlaceholder( n ) )
		.map( canvasLib.nameOf )

	const claudeDirs = canvasLib.childrenOf( canvas, claude.id )
		.filter( ( n ) => !canvasLib.isPlaceholder( n ) )
		.map( canvasLib.nameOf )
		.filter( ( name ) => name && !NEVER_DELETE.has( name ) )

	return { rootFiles, claudeDirs, protected: [ ...NEVER_DELETE ] }
}

// ---- flush ---------------------------------------------------------------
function flush( opts ) {
	const target = path.resolve( opts.target )
	const wl = buildWhitelist( opts.canvasPath )
	const out = { target, delete: !!opts.delete, removed: [], absent: [], failed: [], protected: [] }

	const act = ( label, abs ) => {
		if( !exists( abs ) ) { out.absent.push( label ); return }
		if( !opts.delete ) { out.removed.push( label + folderTag( abs ) ); return }   // inspect: "would remove"
		try {
			fs.rmSync( abs, { recursive: true, force: true, maxRetries: 2, retryDelay: 100 } )
			out.removed.push( label )
		} catch( e ) {
			out.failed.push( { path: label, err: e.message } )
		}
	}

	for( const f of wl.rootFiles ) act( f, path.join( target, f ) )
	for( const d of wl.claudeDirs ) act( `${CLAUDE_DIR}/${d}`, path.join( target, CLAUDE_DIR, d ) )

	// protected paths are reported, never acted on
	for( const p of wl.protected ) {
		const abs = path.join( target, CLAUDE_DIR, p )
		out.protected.push( `${CLAUDE_DIR}/${p} ${exists( abs ) ? '(present, untouched)' : '(absent)'}` )
	}
	return out
}

// ---- reporting -----------------------------------------------------------
function printReport( r ) {
	const w = ( s ) => process.stdout.write( s + '\n' )
	w( '' )
	w( `KCD flush — ${r.delete ? 'DELETE' : 'INSPECT (no changes)'}` )
	w( `target: ${r.target}` )

	const verb = r.delete ? 'removed' : 'would remove'
	w( `\n  ${verb} (${r.removed.length}):` )
	r.removed.length ? r.removed.forEach( ( x ) => w( `    - ${x}` ) ) : w( '    (none)' )

	if( r.failed.length ) {
		w( `\n  FAILED (${r.failed.length}):` )
		r.failed.forEach( ( x ) => w( `    ! ${x.path}: ${x.err}` ) )
	}

	w( `\n  absent / skipped (${r.absent.length}): ${r.absent.length ? r.absent.join( ', ' ) : '(none)'}` )
	w( `\n  protected (never deleted): ${r.protected.join( ' · ' )}` )
	if( !r.delete ) w( '\n  → re-run with --delete to execute.' )
	w( '' )
}

// ---- CLI -----------------------------------------------------------------
if( require.main === module ) {
	const args = parseArgs( process.argv.slice( 2 ) )
	try {
		printReport( flush( args ) )
		process.exitCode = 0
	} catch( e ) {
		process.stderr.write( `\nflush aborted: ${e.message}\n(could not read/parse the canvas at ${CANVAS_PATH})\n\n` )
		process.exitCode = 2
	}
}

module.exports = { flush, buildWhitelist, parseArgs, CANVAS_PATH }
