"use client";

import LoginForm from "./LoginForm";
import styles from "./LoginPage.module.css";
import type { LoginFormProps } from "../type";

export default function LoginPage({
  onSubmit,
  loading = false,
}: LoginFormProps) {
  return (
    <div className={styles["page-root"]}>
      {/* 顶部导航栏, 左侧 Logo, 右侧 Link */}
      <header className={styles.header} role="banner">
        {/* 左侧 Logo */}
        <div className={styles.header__left}>
          <div className={styles.logo}>元识科技</div>
        </div>

        {/* 右侧 Link */}
        <div className={styles.header__right}>
          <a
            href="https://www.example.com"
            target="_blank"
            rel="noreferrer"
            className={styles.header__link}
          >
            产品速览
          </a>
          <a
            href="https://docs.example.com"
            target="_blank"
            rel="noreferrer"
            className={styles.header__link}
          >
            关于我们
          </a>
        </div>
      </header>

      {/* 左右切割 */}
      <main className={styles.main}>
        {/* 左侧 : 登录区 */}
        <section className={styles.left}>
          <div className={styles.left__center}>
            <LoginForm onSubmit={onSubmit} loading={loading} />
          </div>
        </section>

        {/* 右侧 : 图片区 */}
        <aside className={styles.right}>
          <div className={styles.hero}>
            <div className={styles.hero_bg} />

            <div className={styles.hero__caption}>
              <h3>元启万象 • 识达千行</h3>
              <br />
              <br />
              <p>强大工具赋能, 助您精准获客, 提升销量, 高效管理</p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
