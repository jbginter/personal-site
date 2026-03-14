type Task<T> = () => Promise<T>;

interface QueueItem<T> {
  fn: Task<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
}

class TaskQueue {
  #queue: QueueItem<unknown>[] = [];
  #running: number = 0;
  #concurrency: number;

  constructor(concurrency: number = 4) {
    if (concurrency < 1) {
      throw new RangeError("Concurrency must be at least 1");
    }
    this.#concurrency = concurrency;
  }

  /**
   * Add a typed async function to the queue.
   * Returns a Promise that resolves/rejects with the function's result
   * once it eventually executes.
   */
  enqueue<T>(fn: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.#queue.push({ fn, resolve, reject } as QueueItem<unknown>);
      this.#dispatch();
    });
  }

  #dispatch(): void {
    while (this.#running < this.#concurrency && this.#queue.length > 0) {
      const { fn, resolve, reject } = this.#queue.shift()!;
      this.#running++;

      Promise.resolve()
        .then(() => fn())
        .then(resolve, reject)
        .finally(() => {
          this.#running--;
          this.#dispatch();
        });
    }
  }

  /** Number of tasks waiting to run */
  get pending(): number {
    return this.#queue.length;
  }

  /** Number of tasks currently running */
  get active(): number {
    return this.#running;
  }

  /** Total tasks in flight (active + pending) */
  get size(): number {
    return this.#running + this.#queue.length;
  }
}

export default TaskQueue;

export async function example() {
  const delay = <T,>(ms: number, value: T): Task<T> =>
    () => new Promise<T>(resolve => setTimeout(() => resolve(value), ms));

  const queue = new TaskQueue(4); // max 4 concurrent tasks

  const results = await Promise.all([
    queue.enqueue(delay(1000, "Task 1")),
    queue.enqueue(delay(500,  "Task 2")),
    queue.enqueue(delay(800,  "Task 3")),
    queue.enqueue(delay(300,  "Task 4")),
    queue.enqueue(delay(1300,  "Task 5")),
    queue.enqueue(delay(4300,  "Task 6")),
    queue.enqueue(delay(5500,  "Task 7")),
  ]);

  console.log('results', results);       // ["Task 1", "Task 2", "Task 3", "Task 4"]
  console.log('pending', queue.pending); // 0
  console.log('active', queue.active);  // 0
}