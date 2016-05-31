"use strict";
import test from 'ava';
import ESCombinator from '../index';
import util from 'util';

const c = new ESCombinator();

test("Hello, World!", t => {
  const p = c.s("Hello, World!");
	t.true(p.parse("Hello, World!").isSuccess());
	t.true(!p.parse("Hello, World?").isSuccess());
});

test("Hello or World", t => {
  const p = c.s("Hello").or(c.s("World"));
	t.true(p.parse("Hello").isSuccess());
	t.true(p.parse("World").isSuccess());
	t.true(!p.parse("HELLO").isSuccess());
	t.true(!p.parse("WORLD").isSuccess());
});

test("Hello and World", t => {
  const p = c.s("Hello").cat(c.s("World"));
	t.true(p.parse("HelloWorld").isSuccess());
	t.true(!p.parse("World").isSuccess());
	t.true(!p.parse("Hello").isSuccess());
	t.true(!p.parse("WORLD").isSuccess());
});


test("(Hello and World).map", t => {
  const p = c.s("Hello").cat(c.s("World")).map((x) => [x, x].toString());
	const r = p.parse("HelloWorld");
	t.true(r.isSuccess());
	t.true(r.value == [["Hello", "World"], ["Hello", "World"]].toString());
});


test("Hello.flatMap(v => World)", t => {
	const p = c.s("Hello").flatMap((v) => {
		return c.s("World");
	});
	let r = p.parse("Hello");
	t.true(!r.isSuccess());
	r = p.parse("HelloWorld");
	t.true(r.isSuccess());
	t.true(r.value == "World");
});

test("[0-9]+", t => {
	const p1 = c.r("[0-9]+");
	let r = p1.parse("100");
	t.true(r.isSuccess());
	t.true(r.value === "100");
	const p2 = c.r("[0-9]+").map(x => parseInt(x));
	r = p2.parse("100");
	t.true(r.isSuccess());
	t.true(!(r.value === "100"));
	t.true(r.value === 100);
});
