import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRequest, protocolVersion } from '../src/gateway-protocol.ts';

test('网关只接受已知方法、角色与范围', () => {
  const connect = { type: 'req', id: 1, method: 'connect', params: { role: 'shell', scopes: ['tasks', 'pet'], token: 't', protocol: protocolVersion } };
  assert.deepEqual(parseRequest(JSON.stringify(connect)), connect);
  assert.equal(parseRequest(JSON.stringify({ ...connect, params: { ...connect.params, role: 'root' } })), null);
  assert.equal(parseRequest(JSON.stringify({ ...connect, params: { ...connect.params, scopes: ['shell-exec'] } })), null);
  assert.equal(parseRequest(JSON.stringify({ ...connect, params: { ...connect.params, protocol: 99 } })), null);
  assert.equal(parseRequest(JSON.stringify({ ...connect, method: 'exec' })), null);
});

test('空需求、坏 JSON 与缺字段被拒绝', () => {
  assert.equal(parseRequest('{'), null);
  assert.equal(parseRequest(JSON.stringify({ type: 'req', id: 2, method: 'task.create', params: { text: '  ' } })), null);
  assert.ok(parseRequest(JSON.stringify({ type: 'req', id: 2, method: 'task.create', params: { text: '给星笺加导出按钮' } })));
  assert.equal(parseRequest(JSON.stringify({ type: 'req', id: 3, method: 'approval.answer', params: { approval: 'a1' } })), null);
});
