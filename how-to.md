# QuicOTAライブラリ

## 使い方
1. ライブラリをインクルード<br>
`#include <QuicOTA.h>`
2. setupOTAを呼び出す<br>
`setupOTA();`

## setupOTAについて
`setupOTA(A, B, C, D);`

### A
OTAをホストする際のデバイス名 (初期値: ESP-OTA-PROJECT)
### B
OTAをホストする際に使用するWiFiのSSID (初期値: aterm-****-g)
### C
OTAをホストする際に使用するWiFIのパスワード (初期値: 0639****e)
### D
OTAを書き込む際に使用するパスワード (初期値: 86****ru)
