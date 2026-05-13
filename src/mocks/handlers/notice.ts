import { http, HttpResponse } from "msw";
import { mockExampleNotice } from "../data/ExampleNotice";

export const noticeHandlers = [
  http.get("/api/notice", () => {
    return HttpResponse.json(mockExampleNotice);
  }),
];
