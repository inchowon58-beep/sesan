import { SITE } from "@/lib/site";

const REVIEWS = [
  {
    quote:
      "급하게 이사를 가게 되어 상담을 받았는데, 절차와 비용을 차분히 설명해 주셔서 안심하고 입소할 수 있었습니다.",
    name: "김○○ 보호자",
    course: "파양 입소 상담",
  },
  {
    quote:
      "보호중인 아이들 사진을 보고 상담 후 매칭했습니다. 아이 성향까지 꼼꼼히 알려주셔서 적응이 빨랐어요.",
    name: "이○○ 보호자",
    course: "무료분양 매칭",
  },
  {
    quote:
      "전국 어디서나 상담이 가능하다고 해서 문의했는데, 방문이 어려운 저희 상황에 맞춰 방문 픽업까지 안내해 주셨어요.",
    name: "박○○ 보호자",
    course: "방문 픽업",
  },
  {
    quote:
      "입소 후에도 생활 사진을 공유해 주셔서 마음이 놓였습니다. 책임감 있게 케어해 주시는 느낌이었어요.",
    name: "최○○ 보호자",
    course: "입소 후 근황",
  },
  {
    quote:
      "이별이 처음이라 걱정이 많았는데 상담부터 입소까지 차분히 진행돼 믿음이 갔습니다. 추천합니다.",
    name: "정○○ 보호자",
    course: "강아지 파양",
  },
  {
    quote:
      "전화만으로도 절차와 준비물까지 안내해 주셔서 편했습니다. 상담 폼 없이 바로 문의할 수 있어 좋아요.",
    name: "한○○ 보호자",
    course: "전화 상담",
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="dalbit-section dalbit-section-alt">
      <div className="dalbit-container">
        <div className="dalbit-sec-header">
          <span className="dalbit-badge">Reviews</span>
          <h2 className="dalbit-sec-title">
            파양·분양 <em>매칭 사례</em>
          </h2>
          <p className="dalbit-sec-desc">
            {SITE.brand}를 통해 새 가족을 만난 아이들의 입양 후기입니다.
          </p>
        </div>

        <div className="dalbit-review-grid">
          {REVIEWS.map((r) => (
            <blockquote key={r.name + r.course} className="dalbit-review-card">
              <p className="dalbit-review-quote">&ldquo;{r.quote}&rdquo;</p>
              <footer>
                <p className="dalbit-review-name">{r.name}</p>
                <p className="dalbit-review-course">{r.course}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
