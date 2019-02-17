<template>
  <div id="app">
    <h2>概要</h2>
    画像処理100本ノック
    <a
      href="https://github.com/yoyoyo-yo/Gasyori100knock"
    >https://github.com/yoyoyo-yo/Gasyori100knock</a>
    を
    JavaScriptで解いてみました。
    <h2>問題一覧</h2>
    <router-link to="/list">問題一覧</router-link>
    <h2>関連リンク</h2>
    <ul>
      <li>
        <a href="https://github.com/s-yoshiki/Gasyori100knockJS">GitHub: Gasyori100knockJS</a>
      </li>
      <li>
        <a href="https://github.com/yoyoyo-yo/Gasyori100knock">【本家】画像処理100本ノック (Gasyori100knockJS)</a>
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
import ItemComponent from "@/router/questions.js";
export default {
  name: "Root"
};
</script>