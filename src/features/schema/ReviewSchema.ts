import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.string().min(1, "별점을 선택해 주세요."),
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력해 주세요.")
    .max(50, "제목은 최대 50자입니다."),
  content: z.string().trim().min(1, "내용을 입력해 주세요."),
  author: z.string().trim().min(1, "이름을 입력해 주세요."),
  password: z
    .string()
    .refine(
      (val) => !/(\d)\1\1/.test(val),
      "동일한 숫자 3개 이상 연속 사용이 불가합니다.",
    )
    .regex(/^\d{4}$/, "숫자 4자리를 입력해 주세요."),
  isPrivacyAgree: z
    .boolean()
    .refine((val) => val === true, "개인정보 수집 및 이용에 동의해야 합니다."),
});
