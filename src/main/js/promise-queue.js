import { isNotNullOrUndefined } from "./util";

// @ts-check

/**
 * @template T
 * @typedef {() => Promise<T>} PromiseFactory<T>
 */
const PromiseFactory = undefined; // jshint ignore:line

/**
 * A simple queue to which promise factories can be added. It makes sure the promises
 * are called (started) in the order as they were added.
 * @typedef {(value: any)=>void} PromiseCallback
 * @typedef {{factory: PromiseFactory<unknown>, resolve: PromiseCallback, reject: PromiseCallback}} QueueItem
 */
export class PromiseQueue {
    constructor() {
        /** @type {QueueItem[]} */
        this.queue = [];
        /** @type {{resolve: PromiseCallback, reject: PromiseCallback}[]} */
        this.onDone = [];
    }
    /**
     * @template T
     * @param {PromiseFactory<T>} promiseFactory
     * @return {Promise<T>}
     */
    add(promiseFactory) {
        return this.addAll(promiseFactory)[0];
    }
    /**
     * @template T
     * @param {PromiseFactory<T>[]} promiseFactory 
     * @return {Promise<T>[]}
     */
    addAll(...promiseFactory) {
        return promiseFactory
            .filter(isNotNullOrUndefined)
            .map(factory => new Promise((resolve, reject) => {
                this.addQueueItem(factory, resolve, reject);
            }));
    }
    /**
     * 
     * @param {PromiseFactory<unknown>} factory 
     * @param {PromiseCallback} resolve 
     * @param {PromiseCallback} reject 
     */
    addQueueItem(factory, resolve, reject) {
        const wasEmpty = this.queue.length === 0;
        this.queue.push({
            factory: factory,
            resolve: resolve,
            reject: reject,
        });
        if (wasEmpty) {
            this.startQueue();
        }
    }
    startQueue() {
        this.processQueue(this.peek());
    }
    onPromiseDone() {
        this.poll();
        this.processQueue(this.peek());
    }
    /**
     * @param {QueueItem} queueItem 
     */
    processQueue(queueItem) {
        if (queueItem) {
            const promise = PromiseQueue.makePromise(queueItem.factory);
            promise
                .then(queueItem.resolve)
                .catch(queueItem.reject)
                .finally(() => this.onPromiseDone());    
        }
        else {
            this.onDone.forEach(({resolve}) => resolve(undefined));
            this.onDone = [];
        }
    }
    /**
     * @return {QueueItem}
     */
    poll() {
        return this.queue.shift();
    }
    /**
     * @return {QueueItem}
     */
    peek() {
        return this.queue[0];
    }
    /**
     * @return {Promise<void>}
     */
    allDone() {
        if (this.queue.length === 0) {
            return Promise.resolve();
        }
        else {
            return new Promise((resolve, reject) => {
                this.onDone.push({resolve, reject});
            });    
        }
    }
    /**
     * @param {PromiseFactory<unknown>} promiseFactory 
     * @return {Promise<unknown>}
     */
    static makePromise(promiseFactory) {
        try {
            const promise = promiseFactory();
            if (promise !== undefined) {
                return promise;
            }
        }
        catch (e) {
            console.error("Could not create promise", e);
        }
        return Promise.resolve();
    }
}