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
test("J.rep", t => {
  const p = c.s("J").rep();
  let r = p.parse("JJJJ");
  t.true(r.isSuccess());
  t.true(r.value.toString() == ["J", "J", "J", "J"].toString())
});
test("calculator", t => {
  const E = () => A();
  const A = () => 
    c.f(() => M()).cat(((c.s("+").cat(c.f(() => M()))).or(c.s("-").cat(c.f(() => M())))).rep());
  const M = () => 
    c.f(() => P()).cat(((c.s("*").cat(c.f(() => P()))).or(c.s("/").cat(c.f(() => M())))).rep());
  const P = () =>
    (c.s("(").cat(E()).cat(c.s(")"))).or(c.f(() => N()));
  const N = () =>
    c.r("[0-9]+").map((n) => parseInt(n));
  const r1 = E().parse("111");
  const r2 = E().parse("222");
  t.true(r1.isSuccess());
  t.true(r2.isSuccess());
  const r3 = E().parse("A");
  t.true(!r3.isSuccess());
  const r4 = E().parse("(1+2*3)+4");
  t.true(r4.isSuccess());

});
