import { noticeHandlers } from "./notice";
import { reviewHandlers } from "./review";

export const handlers = [...reviewHandlers, ...noticeHandlers];
