export type HealthResponse = {
  status: "ok";
  time: string; // ISO8601
};

export type ExampleResponse = {
  message: string;
  version: number;
};
