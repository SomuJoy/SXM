'use strict';
// https://github.com/DanielRosenwasser/underscore-privates-tslint-rule
var __extends =
    (this && this.__extends) ||
    (function() {
        var extendStatics = function(d, b) {
            extendStatics =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                    function(d, b) {
                        d.__proto__ = b;
                    }) ||
                function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                };
            return extendStatics(d, b);
        };
        return function(d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
        };
    })();
exports.__esModule = true;
var Lint = require('tslint');
var tsutils = require('tsutils');
var ts = require('typescript');
var UNDERSCORE = '_'.charCodeAt(0);
var Rule = /** @class */ (function(_super) {
    __extends(Rule, _super);
    function Rule() {
        return (_super !== null && _super.apply(this, arguments)) || this;
    }
    Rule.prototype.apply = function(sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    Rule.FAILURE_STRING = "private member's name must be prefixed with an underscore";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
function walk(ctx) {
    traverse(ctx.sourceFile);
    function traverse(node) {
        checkNodeForViolations(ctx, node);
        return ts.forEachChild(node, traverse);
    }
}
function checkNodeForViolations(ctx, node) {
    if (!isRelevantClassMember(node)) {
        return;
    }
    // The declaration might have a computed property name or a numeric name.
    var name = node.name;
    if (!nameIsIdentifier(name)) {
        return;
    }
    if (!nameStartsWithUnderscore(name.text) && memberIsPrivate(node)) {
        ctx.addFailureAtNode(name, Rule.FAILURE_STRING);
    }
}
function isRelevantClassMember(node) {
    switch (node.kind) {
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.PropertyDeclaration:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
            return true;
        default:
            return false;
    }
}
function nameStartsWithUnderscore(text) {
    return text.charCodeAt(0) === UNDERSCORE;
}
function memberIsPrivate(node) {
    return tsutils.hasModifier(node.modifiers, ts.SyntaxKind.PrivateKeyword);
}
function nameIsIdentifier(node) {
    return node.kind === ts.SyntaxKind.Identifier;
}
