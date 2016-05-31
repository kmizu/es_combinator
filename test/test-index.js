"use strict";
import test from 'ava';
import ESCombinator from '../index';

const combinator = new ESCombinator();

test("hello", t => {
	combinator.hello();
});
