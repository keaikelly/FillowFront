// 루트 URL("/")로 들어왔을 때 바로 첫 단계(/plan)로 라우팅
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/plan");
}
