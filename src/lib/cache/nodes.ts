/**
 * Provider node caching functions
 */

import { caches } from './core';
import {
  nodeListKey,
  nodeKey,
  nodeAvailabilityKey,
} from './keys';
import {
  NODE_LIST_TTL,
  NODE_TTL,
  NODE_AVAILABILITY_TTL,
} from './ttl';

interface Node {
  id: string;
  providerId: string;
  region: string;
  status: string;
  hardwareSpecs?: Record<string, unknown>;
  earnings?: Record<string, unknown>;
  [key: string]: unknown;
}

interface NodeAvailability {
  available: boolean;
  currentLoad: number;
  maxCapacity: number;
}

interface NodeListResult {
  nodes: Node[];
  total: number;
}

/**
 * Get node list from cache
 */
export function getNodeListCached(status?: string): NodeListResult | undefined {
  const key = nodeListKey(status);
  return caches.node.get(key);
}

/**
 * Cache node list (2min TTL)
 */
export function setNodeListCached(status: string | undefined, data: NodeListResult): void {
  const key = nodeListKey(status);
  caches.node.set(key, data, NODE_LIST_TTL);
}

/**
 * Invalidate all node list caches
 */
export function invalidateNodeList(): void {
  const keys = caches.node.keys('vassal:nodes:list');
  for (const key of keys) {
    caches.node.delete(key);
  }
}

/**
 * Get single node from cache
 */
export function getNodeCached(id: string): Node | undefined {
  const key = nodeKey(id);
  return caches.node.get(key);
}

/**
 * Cache single node (1min TTL)
 */
export function setNodeCached(id: string, data: Node): void {
  const key = nodeKey(id);
  caches.node.set(key, data, NODE_TTL);
}

/**
 * Invalidate single node cache
 */
export function invalidateNode(id: string): void {
  const key = nodeKey(id);
  caches.node.delete(key);
  // Also invalidate availability
  const availKey = nodeAvailabilityKey(id);
  caches.node.delete(availKey);
  // Invalidate list caches
  invalidateNodeList();
}

/**
 * Get node availability from cache
 */
export function getNodeAvailabilityCached(id: string): NodeAvailability | undefined {
  const key = nodeAvailabilityKey(id);
  return caches.node.get(key);
}

/**
 * Cache node availability (30s TTL)
 */
export function setNodeAvailabilityCached(id: string, data: NodeAvailability): void {
  const key = nodeAvailabilityKey(id);
  caches.node.set(key, data, NODE_AVAILABILITY_TTL);
}