# synth\_playground

ブラウザで動く楽器を作るための実験環境です。
正弦波やノイズの再生、ローパスフィルタやリバーブの適応などの実装セットが含まれる予定です。

# 実行方法

```bash
git clone https://github.com/wakewakame/synth_playground.git
cd synth_playground
python3 -m http.server 8080
```

httpサーバが起動するので `http://localhost:8080/` にアクセスする。

