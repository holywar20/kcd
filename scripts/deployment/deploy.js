'use strict'

/**
 * deploy.js — the "fill" of flush-and-fill (v1, intentionally minimal).
 *
 * v1 scope: create the static folder skeleton from the deployment canvas, and lay down the
 * first lens (lens_crafter) at EVERY place the canvas gives it a home — VERBATIM copy for
 * the lens doc, empty folders for the rest. That's it.
 *
 * A lens is a shared identity ("{lensname}") that appears in several disconnected branches
 * of the canvas — lenses/, work/, logs/. Deploying it means materializing all of them, so
 * we match the identity across the WHOLE node list rather than trawling one path.
 *
 * Deferred (after the procedure refactor): copying kcd in, CLAUDE.md generation + lens
 * registration, path rewrites, Disabled->Active, templates/bases/registries, params. This
 * step only proves placement.
 *
 * kcd is the canonical SOURCE — never created or copied (it already exists; "shouldn't
 * change ever"). Application-layer tooling — folds into Starmind later. NOT a kcd artifact.
 *
 *   node deploy.js                      plan against the default project (no changes)
 *   node deploy.js --go                 deploy into the default project
 *   node deploy.js --target <path>      plan against another location
 *   node deploy.js --target <path> --go
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
const KCD_ROOT = findKcdRoot( __dirname )                     // .../_Claude/kcd
const CANVAS_PATH = path.join( KCD_ROOT, 'docs', 'deployment_schema.canvas' )
const KCD_SOURCE = KCD_ROOT                                 // canonical library (the copy source)
const PROJECT_ROOT = path.resolve( KCD_ROOT, '..', '..' )     // default target: project root (parent of _Claude)
const CLAUDE_DIR = '_Claude'
const SKIP_DIRS = new Set( [ 'kcd' ] )                          // canonical — never created by deploy
const LENS_PLACEHOLDER = '{lensname}'
const FIRST_LENS = 'lens_crafter'                           // the one lens we hand-deploy in v1

// ---- args ----------------------------------------------------------------
function parseArgs( argv ) {
	const a = { target: PROJECT_ROOT, go: false }
	for( let i = 0; i < argv.length; i++ ) {
		const t = argv[ i ]
		if( t === '--target' || t === '-t' ) a.target = argv[ ++i ]
		else if( t === '--go' || t === '--deploy' || t === '--force' || t === '-g' ) a.go = true
		else if( t && !t.startsWith( '-' ) ) a.target = t
	}
	a.target = path.resolve( a.target )
	return a
}

// ---- static folder set (folders reachable without crossing a placeholder) ----
function staticFolders( canvasOrPath = CANVAS_PATH ) {
	const canvas = typeof canvasOrPath === 'string' ? canvasLib.load( canvasOrPath ) : canvasOrPath
	const claude = canvasLib.findByText( canvas, CLAUDE_DIR )
	if( !claude ) throw new Error( 'canvas missing a "_Claude" node' )

	const out = [ CLAUDE_DIR ]
	const walk = ( nodeId, prefix ) => {
		for( const child of canvasLib.childrenOf( canvas, nodeId ) ) {
			if( canvasLib.isFile( child ) || canvasLib.isPlaceholder( child ) ) continue  // folders, no instances
			const nm = canvasLib.nameOf( child )
			if( !nm || SKIP_DIRS.has( nm ) ) continue                                   // skip kcd subtree
			const rel = `${prefix}/${nm}`
			out.push( rel )
			walk( child.id, rel )
		}
	}
	walk( claude.id, CLAUDE_DIR )
	return out
}

// ---- deploy --------------------------------------------------------------
function deploy( opts ) {
	const live = !!opts.go
	const target = path.resolve( opts.target )
	const canvas = typeof opts.canvasPath === 'string'
		? canvasLib.load( opts.canvasPath )
		: ( opts.canvas || canvasLib.load( CANVAS_PATH ) )
	const r = { target, live, created: [], copied: [], exists: [], skipped: [], failed: [] }

	const mk = ( rel ) => {
		const abs = path.join( target, rel )
		if( fs.existsSync( abs ) ) { r.exists.push( rel ); return }
		if( !live ) { r.created.push( rel ); return }
		try { fs.mkdirSync( abs, { recursive: true } ); r.created.push( rel ) }
		catch( e ) { r.failed.push( { path: rel, err: e.message } ) }
	}
	const copy = ( src, rel ) => {
		const abs = path.join( target, rel )
		if( !fs.existsSync( src ) ) { r.failed.push( { path: rel, err: `source not found: ${src}` } ); return }
		if( !live ) { r[ fs.existsSync( abs ) ? 'exists' : 'copied' ].push( `${rel} (verbatim)` ); return }
		try {
			fs.mkdirSync( path.dirname( abs ), { recursive: true } )
			fs.copyFileSync( src, abs )
			r.copied.push( `${rel} (verbatim)` )
		} catch( e ) { r.failed.push( { path: rel, err: e.message } ) }
	}

	// 1. static skeleton
	for( const rel of staticFolders( canvas ) ) mk( rel )

	// 2. first lens — every {lensname} node in the canvas, name substituted (broad identity match)
	for( const node of canvasLib.instanceNodes( canvas, LENS_PLACEHOLDER ) ) {
		const rel = canvasLib.pathOf( canvas, node )
			.map( ( s ) => s.split( LENS_PLACEHOLDER ).join( FIRST_LENS ) )
			.join( '/' )
		if( canvasLib.isFile( node ) ) {
			if( rel.endsWith( `/${FIRST_LENS}.md` ) ) {
				copy( path.join( KCD_SOURCE, 'lenses', `${FIRST_LENS}.md` ), rel )   // the lens doc
			} else {
				r.skipped.push( `${rel} (seed file — deferred)` )                  // future templated files
			}
		} else {
			mk( rel )
		}
	}
	return r
}

// ---- reporting -----------------------------------------------------------
function printReport( r ) {
	const w = ( s ) => process.stdout.write( s + '\n' )
	w( '' )
	w( `KCD deploy — ${r.live ? 'LIVE' : 'PLAN (no changes)'}` )
	w( `target: ${r.target}` )
	w( `source: ${KCD_SOURCE}  (kcd is the source — never created/copied)` )

	const v = r.live ? 'created' : 'would create'
	w( `\n  folders ${v} (${r.created.length}):` )
	r.created.length ? r.created.forEach( ( x ) => w( `    + ${x}` ) ) : w( '    (none)' )

	const cv = r.live ? 'copied' : 'would copy'
	w( `\n  files ${cv} (${r.copied.length}):` )
	r.copied.length ? r.copied.forEach( ( x ) => w( `    > ${x}` ) ) : w( '    (none)' )

	if( r.skipped.length ) { w( `\n  skipped (${r.skipped.length}):` ); r.skipped.forEach( ( x ) => w( `    ~ ${x}` ) ) }
	if( r.exists.length ) w( `\n  already present (${r.exists.length}): ${r.exists.join( ', ' )}` )
	if( r.failed.length ) {
		w( `\n  FAILED (${r.failed.length}):` )
		r.failed.forEach( ( x ) => w( `    ! ${x.path}: ${x.err}` ) )
	}
	if( !r.live ) w( '\n  → re-run with --go to execute.' )
	w( '' )
}

// ---- CLI -----------------------------------------------------------------
if( require.main === module ) {
	const args = parseArgs( process.argv.slice( 2 ) )
	try {
		printReport( deploy( args ) )
		process.exitCode = 0
	} catch( e ) {
		process.stderr.write( `\ndeploy aborted: ${e.message}\n(could not read/parse the canvas at ${CANVAS_PATH})\n\n` )
		process.exitCode = 2
	}
}

module.exports = { deploy, staticFolders, parseArgs, CANVAS_PATH, KCD_SOURCE }
