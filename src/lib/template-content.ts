import type { SeoPage } from "./seo-pages";
import { generateRegionalSeoPage } from "./regional-seo";

/**
 * 관리자 "템플릿(로컬)" 발행 모드에서 사용하는 생성 함수.
 * 실제 생성 로직은 regional-seo.ts의 지역 랜딩형 생성기를 그대로 사용한다
 * (Gemini 없이도 ilsan 수준 이상의 구조를 만들기 위함).
 */
export function generateTemplateContent(keyword: string, pageIndex = 1): SeoPage {
  return generateRegionalSeoPage(keyword, pageIndex);
}
