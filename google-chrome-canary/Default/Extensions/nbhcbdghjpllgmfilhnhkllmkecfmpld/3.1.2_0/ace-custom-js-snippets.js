//import ace from 'ace-builds'
ace.define(
  'ace/snippets/javascript.snippets',
  ['require', 'exports', 'module'],
  function (require, exports, module) {
    module.exports = `
    
# Prototype

snippet proto
\t$\{1:class_name}.prototype.$\{2:method_name} = function($\{3:first_argument}) {
\t\t$\{4:// body...}
\t};

# Function

snippet fun

\tfunction $\{1?:function_name}($\{2:argument}) {
\t\t$\{3:// body...}
\t}

# Anonymous Function

regex /((=)\\s*|(:)\\s*|(\\()|\\b)/f/(\\))?/
snippet f
\tfunction$\{M1?: $\{1:functionName}}($2) {
\t\t$\{0:$TM_SELECTED_TEXT}
\t}$\{M2?;}$\{M3?,}$\{M4?)}

# Immediate function

trigger \\(?f\\(
endTrigger \\)?
snippet f(
\t(function($\{1}) {
\t\t$\{0:$\{TM_SELECTED_TEXT:/* code */}}
\t}($\{1}));

# if

snippet if
\tif ($\{1:true}) {
\t\t$\{0}
\t}

# if ... else

snippet ife
\tif ($\{1:true}) {
\t\t$\{2}
\t} else {
\t\t$\{0}
\t}

# tertiary conditional

snippet ter
\t$\{1:/* condition */} ? $\{2:a} : $\{3:b}

# switch

snippet switch
\tswitch ($\{1:expression}) {
\t\tcase '$\{3:case}':
\t\t\t$\{4:// code}
\t\t\tbreak;
\t\t$\{5}
\t\tdefault:
\t\t\t$\{2:// code}
\t}

# case

snippet case
\tcase '$\{1:case}':
\t\t$\{2:// code}
\t\tbreak;
\t$\{3}

# while (...) {...}

snippet wh
\twhile ($\{1:/* condition */}) {
\t\t$\{0:/* code */}
\t}

# try

snippet try
\ttry {
\t\t$\{0:/* code */}
\t} catch (e) {}

# do...while

snippet do
\tdo {
\t\t$\{2:/* code */}
\t} while ($\{1:/* condition */});

# Object Method

snippet :f
regex /([,{[])|^\\s*/:f/
\t$\{1:method_name}: function($\{2:attribute}) {
\t\t$\{0}
\t}$\{3:,}

# setTimeout function

snippet setTimeout
regex /\\b/st|timeout|setTimeo?u?t?/
\tsetTimeout(function() {$\{3:$TM_SELECTED_TEXT}}, $\{1:10});

# Get Elements

snippet gett
\tgetElementsBy$\{1:TagName}('$\{2}')$\{3}

# Get Element

snippet get
\tgetElementBy$\{1:Id}('$\{2}')$\{3}

# console.log (Firebug)

snippet cl
\tconsole.log($\{1});

# return

snippet ret
\treturn $\{1:result}

# for (property in object ) { ... }

snippet fori
\tfor (var $\{1:prop} in $\{2:Things}) {
\t\t$\{0:$2[$1]}
\t}

# hasOwnProperty

snippet has
\thasOwnProperty($\{1})

# docstring

snippet /**
\t/**
\t * $\{1:description}
\t *
\t */
snippet @par
regex /^\\s*\\*\\s*/@(para?m?)?/
\t@param {$\{1:type}} $\{2:name} $\{3:description}
snippet @ret
\t@return {$\{1:type}} $\{2:description}

# JSON.parse

snippet jsonp
\tJSON.parse($\{1:jstr});

# JSON.stringify

snippet jsons
\tJSON.stringify($\{1:object});

# self-defining function

snippet sdf
\tvar $\{1:function_name} = function($\{2:argument}) {
\t\t$\{3:// initial code ...}
\t\t$1 = function($2) {
\t\t\t$\{4:// main code}
\t\t};
\t}

# singleton

snippet sing
\tfunction $\{1:Singleton} ($\{2:argument}) {
\t\t// the cached instance
\t\tvar instance;
\t\t// rewrite the constructor
\t\t$1 = function $1($2) {
\t\t\treturn instance;
\t\t};
\t\t
\t\t// carry over the prototype properties
\t\t$1.prototype = this;
\t\t// the instance
\t\tinstance = new $1();
\t\t// reset the constructor pointer
\t\tinstance.constructor = $1;
\t\t$\{3:// code ...}
\t\treturn instance;
\t}

# class

snippet class
regex /^\\s*/clas{0,2}/
\tvar $\{1:class} = function($\{20}) {
\t\t$40$0
\t};
\t
\t(function() {
\t\t$\{60:this.prop = ''}
\t}).call($\{1:class}.prototype);
\t
\texports.$\{1:class} = $\{1:class};

# 

snippet for-
\tfor (var $\{1:i} = $\{2:Things}.length; $\{1:i}--; ) {
\t\t$\{0:$\{2:Things}[$\{1:i}];}
\t}

# for (...) {...}

snippet for
\tfor (var $\{1:i} = 0; $1 < $\{2:Things}.length; $1++) {
\t\t$\{3:$2[$1]}$0
\t}

# for (...) {...} (Improved Native For-Loop)

snippet forr
\tfor (var $\{1:i} = $\{2:Things}.length - 1; $1 >= 0; $1--) {
\t\t$\{3:$2[$1]}$0
\t}

#modules

snippet def
\tdefine(function(require, exports, module) {
\t'use strict';
\tvar $\{1/.*\\///} = require('$\{1}');
\t
\t$TM_SELECTED_TEXT
\t});
snippet req
guard ^\\s*
\tvar $\{1/.*\\///} = require('$\{1}');
\t$0
snippet requ
guard ^\\s*
\tvar $\{1/.*\\/(.)/\\u$1/} = require('$\{1}').$\{1/.*\\/(.)/\\u$1/};
\t$0
snippet document
\tdocument
snippet querySelector
\tquerySelector('$\{1}')
snippet querySelectorAll
\tquerySelectorAll('$\{1}')
snippet console.log
\tconsole.log($\{1});
snippet location
\tlocation
snippet href
\thref
snippet getAttribute
\tgetAttribute('$\{1}')
snippet setAttribute
\tsetAttribute('$\{1:name}', '$\{2:value}')
snippet removeAttribute
\tremoveAttribute('$\{1}')
snippet classList 
\tclassList
`
  },
)
ace.define(
  'ace/snippets/javascript',
  ['require', 'exports', 'module', 'ace/snippets/javascript.snippets'],
  function (require, exports, module) {
    'use strict'
    exports.snippetText = require('./javascript.snippets')
    exports.scope = 'javascript'
  },
)
;(function () {
  ace.require(['ace/snippets/javascript'], function (m) {
    if (typeof module == 'object' && typeof exports == 'object' && module) {
      module.exports = m
    }
  })
})()
