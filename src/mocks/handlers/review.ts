import { http, HttpResponse } from "msw";
import { mockExampleReviews } from "../data/ExampleReview";

export const reviewHandlers = [
  http.get("/api/reviews", () => {
    return HttpResponse.json(mockExampleReviews);
  }),
];
