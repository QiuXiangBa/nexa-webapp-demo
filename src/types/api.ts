export interface ApiOut<T> {
  code: number;
  desc?: string;
  data?: T;
}
