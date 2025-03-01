import setup from './share'

exports.spectrum = [
  '#0000CC',
  '#0000FF',
  '#0033CC',
  '#0033FF',
  '#0066CC',
  '#0066FF',
  '#0099CC',
  '#0099FF',
  '#00CC00',
  '#00CC33',
  '#00CC66',
  '#00CC99',
  '#00CCCC',
  '#00CCFF',
  '#3300CC',
  '#3300FF',
  '#3333CC',
  '#3333FF',
  '#3366CC',
  '#3366FF',
  '#3399CC',
  '#3399FF',
  '#33CC00',
  '#33CC33',
  '#33CC66',
  '#33CC99',
  '#33CCCC',
  '#33CCFF',
  '#6600CC',
  '#6600FF',
  '#6633CC',
  '#6633FF',
  '#66CC00',
  '#66CC33',
  '#9900CC',
  '#9900FF',
  '#9933CC',
  '#9933FF',
  '#99CC00',
  '#99CC33',
  '#CC0000',
  '#CC0033',
  '#CC0066',
  '#CC0099',
  '#CC00CC',
  '#CC00FF',
  '#CC3300',
  '#CC3333',
  '#CC3366',
  '#CC3399',
  '#CC33CC',
  '#CC33FF',
  '#CC6600',
  '#CC6633',
  '#CC9900',
  '#CC9933',
  '#CCCC00',
  '#CCCC33',
  '#FF0000',
  '#FF0033',
  '#FF0066',
  '#FF0099',
  '#FF00CC',
  '#FF00FF',
  '#FF3300',
  '#FF3333',
  '#FF3366',
  '#FF3399',
  '#FF33CC',
  '#FF33FF',
  '#FF6600',
  '#FF6633',
  '#FF9900',
  '#FF9933',
  '#FFCC00',
  '#FFCC33'
];



exports.formatArgs = formatArgs
exports.log = console.debug || console.log || (() => { }); // No-op if log is not available
exports.storage = localStorage
exports.load = load;
exports.save = save;


/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {
    // Swallow
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
  let r;
  try {
    r = exports.storage.getItem('debug');
  } catch (error) {
    // Swallow
  }

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}





/**
 * @example
 * before ->
 *  [
   '%c user logged %c message  %s',
  'color: green',      // caller style color
  'color: blue',       // caller style color
  "admin"              // formatStr
]
 * after ->
 * [
  '%c app:server %c %c user logged %c message %s %c +0ms',
  'color: #ff0000',    // ns color
  'color: inherit',    // reset
  'color: green',      // caller style color
  'color: blue',       // caller style color
  'admin'              // formatStr
  'color: #999',       // timestamp color
]
 */

/**
 * @this {DebugInstance}
 */

function formatArgs(args) {
  args[0] = '%c' + this.namespace +
    ' %c' + args[0] +
    '%c' + '+' + createDebug.humanize(this.diff)


  const c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')
  // other format specifiers %c, %s

  let index = 0;
  let lastC = 0;

  args[0].replace(/%[a-zA-Z%]/g, match => {
    if (match === '%%') {
      return;
    }
    index++;
    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}



// module.exports = require('./share')(exports)
const createDebug = setup(exports)

const { formatters } = createDebug;

formatters.j = function (v: string) {
  try {
    return JSON.stringify(v)
  } catch (error) {
    return '[UnexpectedJSONParseError:' + error.message
  }
}


export default createDebug






