<template>
  <div id="app">
    <h2>概要</h2>
    <a
      href="https://github.com/yoyoyo-yo/Gasyori100knock"
    >画像処理100本ノック</a>
    を
    JavaScriptで解いてみました。
    <h2>問題一覧</h2>
    <router-link to="/list" class="questions-link">
      問題一覧ページへ
    </router-link>
    <h2>GitHub</h2>
    <ul>
      <li>
        <a href="https://github.com/s-yoshiki/Gasyori100knockJS">
          Gasyori100knockJS - 画像処理100本ノックJS
        </a>
      </li>
    </ul>
    <h2>参考</h2>
    <blockquote>
      yoyoyo-yo. Gasyori100knock(画像処理100本ノック) 
      <br>
      <a href="https://github.com/yoyoyo-yo/Gasyori100knock">https://github.com/yoyoyo-yo/Gasyori100knock</a>
      <br>
      2019
    </blockquote>
  </div>
</template>
<script>
export default {
  name: "Root"
};
</script>
<style>
.questions-link {
  font: 1.5em sans-serif;
}
</style>