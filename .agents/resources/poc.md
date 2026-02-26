import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Settings, Maximize, Minimize, Shuffle, RotateCcw, Trash2 } from "lucide-react";

// =====================
// Data (keep separately)
// =====================
// Paste/replace this markdown table to update the deck.
const RAW_VOCAB_MD = String.raw`
| # | Japanese | Furigana | English | Chinese | Example Sentence | Translation |
|---|----------|----------|---------|---------|-----------------|-------------|
| 1 | 友だち | ともだち | friend | 朋友 | 友(とも)だちと映画(えいが)を見(み)ました。 | I watched a movie with my friend. |
| 2 | 来週 | らいしゅう | next week | 下周 | 来週(らいしゅう)、京都(きょうと)に行(い)きます。 | I'm going to Kyoto next week. |
| 3 | バックパック | ばっくぱっく | backpack | 背包 | このバックパックは軽(かる)くていいです。 | This backpack is light and nice. |
| 4 | 買い物リスト | かいものりすと | shopping list | 购物清单 | 買(か)い物(もの)リストを作(つく)りました。 | I made a shopping list. |
| 5 | よ | よ | (assertive sentence-ending particle) | 哦（语气词） | これはおいしいよ。 | This is delicious, you know! |
| 6 | 店 | みせ | shop / store | 商店 | あの店(みせ)は安(やす)いです。 | That store is cheap. |
| 7 | ワンピース | わんぴーす | one-piece dress | 连衣裙 | 青(あお)いワンピースを買(か)いました。 | I bought a blue one-piece dress. |
| 8 | やわらかい | やわらかい | soft / tender | 柔软 | このパンはやわらかいですね。 | This bread is soft, isn't it. |
| 9 | ズボン | ずぼん | trousers / pants | 裤子 | 新(あたら)しいズボンが欲(ほ)しいです。 | I want new trousers. |
| 10 | ちがう | ちがう | to be different / wrong | 不同的 | それはちがいます。 | That is wrong / different. |
| 11 | がおすすめ | がおすすめ | recommended | 推荐 | ここのラーメンがおすすめです。 | The ramen here is recommended. |
| 12 | しょうひん | しょうひん | product / merchandise | 商品 | この店(みせ)のしょうひんはきれいです。 | The products in this shop are beautiful. |
| 13 | すてます | すてます | to throw away | 扔 | 古(ふる)い雑誌(ざっし)をすてます。 | I will throw away the old magazines. |
| 14 | がら | がら | pattern / design | 图案 | 花(はな)のがらのシャツを買(か)いました。 | I bought a shirt with a flower pattern. |
| 15 | Lサイズ | えるさいず | L size / large | 大号 | Lサイズはありますか？ | Do you have an L size? |
| 16 | みじかい | みじかい | short (length) | 短 | このスカートはみじかいです。 | This skirt is short. |
| 17 | やったー | やったー | Yes! / I did it! | 太好了！ | テストに合格(ごうかく)した！やったー！ | I passed the test! Yes! |
| 18 | そうですね | そうですね | That's right / I see | 是啊 | そうですね、むずかしいですね。 | That's right, it's difficult, isn't it. |
| 19 | 入れます | いれます | to put in | 放入 | バッグにノートを入(い)れます。 | I put the notebook in the bag. |
| 20 | こみます | こみます | to be crowded | 拥挤 | 駅(えき)はいつもこんでいます。 | The station is always crowded. |
| 21 | カモ | かも | duck | 鸭子 | 池(いけ)にカモがいます。 | There are ducks in the pond. |
| 22 | そろそろ | そろそろ | about time / soon | 差不多该了 | そろそろ帰(かえ)りましょう。 | It's about time we head home. |
| 23 | 来年 | らいねん | next year | 明年 | 来年(らいねん)、日本(にほん)に行(い)きます。 | I'm going to Japan next year. |
| 24 | いけ | いけ | pond | 池塘 | 公園(こうえん)のいけは大(おお)きいです。 | The pond in the park is large. |
| 25 | やきそば | やきそば | fried noodles | 炒面 | やきそばを作(つく)りましょう。 | Let's make fried noodles. |
| 26 | やたい | やたい | food stall | 小吃摊 | まつりのやたいで食(た)べました。 | I ate at the festival food stall. |
| 27 | もう一つ | もうひとつ | one more | 再一个 | もう一(ひと)つください。 | Please give me one more. |
| 28 | じこ | じこ | accident | 事故 | きのうじこがありました。 | There was an accident yesterday. |
| 29 | えきいん | えきいん | station staff | 车站工作人员 | えきいんに聞(き)きました。 | I asked the station staff. |
| 30 | アナウンス | あなうんす | announcement | 广播 | 電車(でんしゃ)のアナウンスを聞(き)いてください。 | Please listen to the train announcement. |
| 31 | どうしましょうか | どうしましょうか | What shall we do? | 怎么办好呢 | 雨(あめ)が降(ふ)っています。どうしましょうか。 | It's raining. What shall we do? |
| 32 | モノレール | ものれーる | monorail | 单轨列车 | モノレールで空港(くうこう)に行(い)きます。 | I go to the airport by monorail. |
| 33 | 電車 | でんしゃ | train | 火车 | 電車(でんしゃ)で会社(かいしゃ)に行(い)きます。 | I go to work by train. |
| 34 | 八分 | はっぷん | eight minutes | 八分钟 | 駅(えき)まで八分(はっぷん)かかります。 | It takes eight minutes to the station. |
| 35 | 今週 | こんしゅう | this week | 这周 | 今週(こんしゅう)はとても忙(いそが)しいです。 | I am very busy this week. |
| 36 | もち | もち | mochi rice cake | 麻糬 | お正月(しょうがつ)にもちを食(た)べます。 | We eat mochi at New Year. |
| 37 | すずしい | すずしい | cool / refreshing | 凉爽 | 今日(きょう)はすずしいですね。 | It's cool today, isn't it. |
| 38 | 花見をします | はなみをします | cherry blossom viewing | 赏花 | 来週(らいしゅう)、公園(こうえん)で花見(はなみ)をします。 | We'll do cherry blossom viewing at the park next week. |
| 39 | かじ | かじ | housework / chores | 家务 | 毎日(まいにち)かじをします。 | I do housework every day. |
| 40 | そうじ | そうじ | cleaning / sweeping | 打扫 | 部屋(へや)のそうじをしました。 | I cleaned the room. |
| 41 | 明日 | あした | tomorrow | 明天 | 明日(あした)、友(とも)だちに会(あ)います。 | I will meet my friend tomorrow. |
| 42 | うち | うち | home / my house | 家 | うちに帰(かえ)りたいです。 | I want to go home. |
| 43 | キャンセルします | きゃんせるします | to cancel | 取消 | 予約(よやく)をキャンセルします。 | I will cancel the reservation. |
| 44 | おかゆ | おかゆ | rice porridge / congee | 粥 | 病気(びょうき)のときはおかゆを食(た)べます。 | When sick, I eat rice porridge. |
| 45 | バナナ | ばなな | banana | 香蕉 | バナナを三本(さんぼん)買(か)いました。 | I bought three bananas. |
| 46 | ツアー | つあー | tour | 观光团 | バスのツアーに参加(さんか)しました。 | I joined a bus tour. |
| 47 | ふくおか | ふくおか | Fukuoka (city) | 福冈 | ふくおかはラーメンが有名(ゆうめい)です。 | Fukuoka is famous for ramen. |
| 48 | しま | しま | island | 岛 | あのしまはきれいです。 | That island is beautiful. |
| 49 | みなと | みなと | port / harbor | 港口 | みなとで船(ふね)を見(み)ました。 | I saw a ship at the port. |
| 50 | クルーズ | くるーず | cruise | 游轮 | クルーズで旅行(りょこう)したいです。 | I want to travel by cruise. |
| 51 | パイナップル | ぱいなっぷる | pineapple | 菠萝 | パイナップルはあまくておいしいです。 | Pineapple is sweet and delicious. |
| 52 | ストロー | すとろー | straw | 吸管 | ストローでジュースを飲(の)みます。 | I drink juice with a straw. |
| 53 | タコライス | たこらいす | taco rice | 章鱼饭 | 沖縄(おきなわ)でタコライスを食(た)べました。 | I ate taco rice in Okinawa. |
| 54 | マンゴー | まんごー | mango | 芒果 | マンゴーのジュースが好(す)きです。 | I like mango juice. |
| 55 | つめたい | つめたい | cold (to the touch) | 冰的 | つめたいビールを飲(の)みたいです。 | I want to drink cold beer. |
| 56 | うみがめ | うみがめ | sea turtle | 海龟 | 海(うみ)でうみがめを見(み)ました。 | I saw a sea turtle in the ocean. |
| 57 | 木 | き | tree / wood | 树 | 公園(こうえん)に大(おお)きな木(き)があります。 | There is a large tree in the park. |
| 58 | 車 | くるま | car | 车 | 新(あたら)しい車(くるま)を買(か)いました。 | I bought a new car. |
| 59 | けしき | けしき | scenery | 风景 | 山(やま)のけしきはすばらしいです。 | The mountain scenery is wonderful. |
| 60 | カード | かーど | card | 卡 | カードで払(はら)えますか？ | Can I pay by card? |
| 61 | げんきん | げんきん | cash | 现金 | げんきんしかありません。 | I only have cash. |
| 62 | まあまあ | まあまあ | so-so / not bad | 还行 | 映画(えいが)はまあまあでした。 | The movie was so-so. |
| 63 | まどがわ | まどがわ | window seat | 靠窗 | まどがわの席(せき)がいいです。 | I'd like a window seat. |
| 64 | メール | めーる | email | 电子邮件 | メールを送(おく)りました。 | I sent an email. |
| 65 | ねだん | ねだん | price | 价格 | このかばんのねだんはいくらですか？ | What is the price of this bag? |
| 66 | しらべます | しらべます | to look up / research | 查找 | 意味(いみ)をしらべます。 | I will look up the meaning. |
| 67 | 海 | うみ | sea / ocean | 大海 | 夏(なつ)に海(うみ)へ行(い)きたいです。 | I want to go to the sea in summer. |
| 68 | サーフィン | さーふぃん | surfing | 冲浪 | ハワイでサーフィンをしました。 | I went surfing in Hawaii. |
| 69 | 五月 | ごがつ | May | 五月 | 五月(ごがつ)は天気(てんき)がいいです。 | May has nice weather. |
| 70 | イルカ | いるか | dolphin | 海豚 | イルカがかわいいです。 | Dolphins are cute. |
| 71 | ノート | のーと | notebook | 笔记本 | ノートに書(か)きました。 | I wrote in my notebook. |
| 72 | メールします | めーるします | to send an email | 发邮件 | あとでメールします。 | I will email you later. |
| 73 | かります | かります | to borrow | 借 | ペンをかしてください。あ、かります。 | Please lend me a pen. Oh, I'll borrow it. |
| 74 | 電話します | でんわします | to make a phone call | 打电话 | 明日(あした)、電話(でんわ)します。 | I will call you tomorrow. |
| 75 | ねつ | ねつ | fever / heat | 发烧 | 子供(こども)がねつを出(だ)しました。 | My child got a fever. |
| 76 | 何も | なにも | nothing / anything | 什么都（不） | 何(なに)も食(た)べたくないです。 | I don't want to eat anything. |
| 77 | 雨 | あめ | rain | 雨 | 今日(きょう)は雨(あめ)が降(ふ)っています。 | It's raining today. |
| 78 | の中で | のなかで | inside / among | 在…之中 | 果物(くだもの)の中(なか)でりんごが一番(いちばん)好(す)きです。 | Among fruits, I like apples the most. |
| 79 | かならず | かならず | certainly / without fail | 一定 | かならず連絡(れんらく)します。 | I will definitely get in touch. |
| 80 | スタッフ | すたっふ | staff / employee | 员工 | スタッフにきいてください。 | Please ask the staff. |
| 81 | おきゃくさん | おきゃくさん | customer / guest | 客人 | おきゃくさんが来(き)ました。 | A guest has arrived. |
| 82 | レビュー | れびゅー | review | 评价 | レストランのレビューを読(よ)みました。 | I read the restaurant's review. |
| 83 | 書きます | かきます | to write | 写 | 日本語(にほんご)で手紙(てがみ)を書(か)きます。 | I will write a letter in Japanese. |
| 84 | しんせん | しんせん | fresh | 新鲜 | この魚(さかな)はしんせんです。 | This fish is fresh. |
| 85 | きのこ | きのこ | mushroom | 蘑菇 | きのこのスープを作(つく)りました。 | I made mushroom soup. |
| 86 | きせつの | きせつの | seasonal | 时令的 | きせつの野菜(やさい)を食(た)べます。 | I eat seasonal vegetables. |
| 87 | さしみ | さしみ | sashimi | 生鱼片 | さしみはとても新鮮(しんせん)です。 | The sashimi is very fresh. |
| 88 | たたみ | たたみ | tatami mat | 榻榻米 | 旅館(りょかん)のたたみは気持(きも)ちいいです。 | The tatami at the inn feels wonderful. |
| 89 | 入口 | いりぐち | entrance | 入口 | 入口(いりぐち)はどこですか？ | Where is the entrance? |
| 90 | もり | もり | forest | 森林 | もりの中(なか)を歩(ある)きました。 | I walked through the forest. |
| 91 | りっぱ | りっぱ | splendid / impressive | 出色 | りっぱなお城(しろ)ですね。 | What a splendid castle! |
| 92 | まわり | まわり | surroundings / around | 周围 | 家(いえ)のまわりに花(はな)があります。 | There are flowers around the house. |
| 93 | 二日間 | ふつかかん | two days | 两天 | 二日間(ふつかかん)、京都(きょうと)に泊(と)まりました。 | I stayed in Kyoto for two days. |
| 94 | かぐ | かぐ | furniture | 家具 | 新(あたら)しいかぐを買(か)いました。 | I bought new furniture. |
| 95 | ペット | ぺっと | pet | 宠物 | ペットを飼(か)いたいです。 | I want to keep a pet. |
| 96 | 間 | あいだ | between / interval | 之间 | 学校(がっこう)と駅(えき)の間(あいだ)にコンビニがあります。 | There is a convenience store between the school and the station. |
| 97 | ソファ | そふぁ | sofa | 沙发 | ソファでテレビを見(み)ます。 | I watch TV on the sofa. |
| 98 | だんなさん | だんなさん | husband | 丈夫 | だんなさんは今日(きょう)、出張(しゅっちょう)です。 | My husband is on a business trip today. |
| 99 | かべ | かべ | wall | 墙壁 | かべに絵(え)を飾(かざ)りました。 | I decorated the wall with a painting. |
| 100 | げんかん | げんかん | entrance hall / genkan | 玄关 | げんかんで靴(くつ)を脱(ぬ)ぎます。 | We take off shoes at the entrance hall. |
| 101 | スリッパ | すりっぱ | slippers | 拖鞋 | スリッパをはいてください。 | Please put on slippers. |
| 102 | おくさん | おくさん | wife (someone else's) | 夫人 | 田中(たなか)さんのおくさんはやさしいです。 | Mr. Tanaka's wife is kind. |
| 103 | 午後 | ごご | afternoon / PM | 下午 | 午後(ごご)、会議(かいぎ)があります。 | I have a meeting in the afternoon. |
| 104 | 今月 | こんげつ | this month | 这个月 | 今月(こんげつ)はとても忙(いそが)しいです。 | I am very busy this month. |
| 105 | 東 | ひがし | east | 东边 | 駅(えき)は東(ひがし)にあります。 | The station is to the east. |
| 106 | だれの | だれの | whose | 谁的 | これはだれのかばんですか？ | Whose bag is this? |
| 107 | もん | もん | gate | 门 | お寺(てら)のもんは大(おお)きいです。 | The temple gate is large. |
| 108 | 昨日 | きのう | yesterday | 昨天 | 昨日(きのう)は雨(あめ)でした。 | It was rainy yesterday. |
| 109 | にがい | にがい | bitter (taste) | 苦 | このコーヒーはにがいです。 | This coffee is bitter. |
| 110 | ティッシュ | てぃっしゅ | tissue | 纸巾 | ティッシュをください。 | Please give me a tissue. |
| 111 | 後で | あとで | later / afterwards | 待会儿 | 後(あと)でメールします。 | I'll email you later. |
| 112 | ビタミン | びたみん | vitamin | 维生素 | 毎日(まいにち)ビタミンを飲(の)みます。 | I take vitamins every day. |
| 113 | ぜんぜん | ぜんぜん | not at all | 完全 | 日本語(にほんご)がぜんぜんわかりません。 | I don't understand Japanese at all. |
| 114 | マスク | ますく | face mask | 口罩 | 外(そと)ではマスクをつけます。 | I wear a mask outside. |
| 115 | 一日中 | いちにちじゅう | all day long | 一整天 | 一日中(いちにちじゅう)、本(ほん)を読(よ)みました。 | I read books all day long. |
| 116 | あけます | あけます | to open | 打开 | まどをあけてください。 | Please open the window. |
| 117 | むら | むら | village | 村子 | 小(ちい)さなむらに住(す)んでいます。 | I live in a small village. |
| 118 | りょかん | りょかん | Japanese inn | 日式旅馆 | 京都(きょうと)のりょかんに泊(と)まりました。 | I stayed at a Japanese inn in Kyoto. |
| 119 | そぼ | そぼ | grandmother | 祖母 | そぼは料理(りょうり)が上手(じょうず)です。 | My grandmother is good at cooking. |
| 120 | かいがい | かいがい | overseas / abroad | 国外 | かいがいに行(い)きたいです。 | I want to go overseas. |
| 121 | リゾート | りぞーと | resort | 度假村 | バリのリゾートはきれいです。 | The resort in Bali is beautiful. |
| 122 | 一週間 | いっしゅうかん | one week | 一周 | 一週間(いっしゅうかん)、沖縄(おきなわ)にいました。 | I was in Okinawa for one week. |
| 123 | 三日間 | みっかかん | three days | 三天 | 三日間(みっかかん)、東京(とうきょう)で過(す)ごしました。 | I spent three days in Tokyo. |
| 124 | アトラクション | あとらくしょん | amusement park attraction | 游乐设施 | このアトラクションは人気(にんき)があります。 | This attraction is popular. |
| 125 | 何日間 | なんにちかん | how many days | 几天 | 何日間(なんにちかん)、旅行(りょこう)しますか？ | How many days are you traveling? |
| 126 | くもり | くもり | cloudy weather | 阴天 | 今日(きょう)はくもりです。 | It's cloudy today. |
| 127 | ミニゴルフ | みにごるふ | mini golf | 迷你高尔夫 | 子供(こども)とミニゴルフをしました。 | I played mini golf with the children. |
| 128 | ロブスター | ろぶすたー | lobster | 龙虾 | ロブスターを初(はじ)めて食(た)べました。 | I ate lobster for the first time. |
| 129 | 食べほうだい | たべほうだい | all-you-can-eat | 自助餐 | 食(た)べほうだいのレストランに行(い)きました。 | I went to an all-you-can-eat restaurant. |
| 130 | ハンバーガー | はんばーがー | hamburger | 汉堡 | ハンバーガーとポテトを注文(ちゅうもん)しました。 | I ordered a hamburger and fries. |
| 131 | けっこう | けっこう | quite / fairly | 相当 | この本(ほん)はけっこうむずかしいです。 | This book is quite difficult. |
| 132 | ご飯 | ごはん | rice / meal | 饭 | ご飯(ごはん)を食(た)べましょう。 | Let's eat a meal. |
| 133 | いろいろ | いろいろ | various / all kinds | 各种各样 | いろいろな国(くに)を旅行(りょこう)したいです。 | I want to travel to various countries. |
| 134 | ふね | ふね | ship / boat | 船 | ふねで島(しま)に行(い)きます。 | I go to the island by boat. |
| 135 | みずぎ | みずぎ | swimsuit | 泳衣 | 新(あたら)しいみずぎを買(か)いました。 | I bought a new swimsuit. |
| 136 | でした | でした | was/were (past tense) | 是（过去式） | きのうはとても楽(たの)しかったです。いい天気(てんき)でした。 | Yesterday was very fun. The weather was good. |
| 137 | ダサい | ださい | unfashionable / dorky | 土气 | このデザインはダサいです。 | This design is unfashionable. |
| 138 | ほかの | ほかの | other / another | 其他的 | ほかの色(いろ)はありますか？ | Do you have another colour? |
| 139 | わるい | わるい | bad / poor | 坏 | 天気(てんき)がわるいです。 | The weather is bad. |
| 140 | シリアル | しりある | cereal | 谷物片 | 朝(あさ)はシリアルを食(た)べます。 | I eat cereal in the morning. |
| 141 | 朝ご飯 | あさごはん | breakfast | 早饭 | 朝(あさ)ご飯(はん)を食(た)べましたか？ | Did you eat breakfast? |
| 142 | ベタベタ | べたべた | sticky / clingy | 黏糊糊 | 手(て)がベタベタです。 | My hands are sticky. |
| 143 | シャワー | しゃわー | shower | 淋浴 | 毎朝(まいあさ)シャワーをあびます。 | I take a shower every morning. |
| 144 | シャンプー | しゃんぷー | shampoo | 洗发水 | このシャンプーはいいにおいです。 | This shampoo smells nice. |
| 145 | トイレ | といれ | toilet / restroom | 卫生间 | トイレはどこですか？ | Where is the restroom? |
| 146 | ぬるい | ぬるい | lukewarm / tepid | 温的 | お茶(ちゃ)がぬるいです。 | The tea is lukewarm. |
| 147 | ゴキブリ | ごきぶり | cockroach | 蟑螂 | 台所(だいどころ)でゴキブリを見(み)ました。 | I saw a cockroach in the kitchen. |
| 148 | じゃなかった | じゃなかった | was not (past negative) | 不是（过去否定） | それは私(わたし)のじゃなかったです。 | That was not mine. |
| 149 | カーテン | かーてん | curtain | 窗帘 | カーテンを閉(し)めてください。 | Please close the curtains. |
| 150 | 六階 | ろっかい | 6th floor | 六楼 | 部屋(へや)は六階(ろっかい)です。 | The room is on the 6th floor. |
| 151 | うすい | うすい | thin / light | 薄 | このシャツはうすいです。 | This shirt is thin. |
| 152 | 四日間 | よっかかん | four days | 四天 | 四日間(よっかかん)、大阪(おおさか)に行(い)きました。 | I went to Osaka for four days. |
| 153 | シャトルバス | しゃとるばす | shuttle bus | 穿梭巴士 | 空港(くうこう)までシャトルバスがあります。 | There is a shuttle bus to the airport. |
| 154 | 西 | にし | west | 西边 | 出口(でぐち)は西(にし)にあります。 | The exit is to the west. |
| 155 | こうこく | こうこく | advertisement | 广告 | テレビのこうこくが多(おお)いです。 | There are many TV advertisements. |
| 156 | ゴミ | ごみ | garbage / trash | 垃圾 | ゴミをすてないでください。 | Please do not throw away garbage. |
| 157 | ダイニング | だいにんぐ | dining room | 餐厅 | ダイニングで食(た)べましょう。 | Let's eat in the dining room. |
| 158 | チキン | ちきん | chicken | 鸡肉 | チキンカレーを作(つく)りました。 | I made chicken curry. |
| 159 | かびん | かびん | vase | 花瓶 | テーブルにかびんがあります。 | There is a vase on the table. |
| 160 | てづくりの | てづくりの | handmade | 手工的 | てづくりのケーキです。 | It is a handmade cake. |
| 161 | おととい | おととい | day before yesterday | 前天 | おとといから雨(あめ)が降(ふ)っています。 | It has been raining since the day before yesterday. |
| 162 | 六日 | むいか | 6th day / 6 days | 六号 | 旅行(りょこう)は六日(むいか)からです。 | The trip starts from the 6th. |
| 163 | しんろう | しんろう | groom / bridegroom | 新郎 | しんろうはとてもかっこいいです。 | The groom is very handsome. |
| 164 | アプリ | あぷり | app | 应用程序 | このアプリはべんりです。 | This app is very convenient. |
| 165 | ざんねん | ざんねん | unfortunate / disappointing | 遗憾 | 行(い)けなくてざんねんです。 | It's unfortunate that I can't go. |
| 166 | もんだい | もんだい | problem / issue | 问题 | もんだいがあります。 | There is a problem. |
| 167 | きっと | きっと | surely / certainly | 一定 | きっとうまくいきます。 | It will surely go well. |
| 168 | わかれます | わかれます | to break up / separate | 分手 | 彼女(かのじょ)とわかれました。 | I broke up with my girlfriend. |
| 169 | メイン | めいん | main dish | 主菜 | メインは何(なに)にしますか？ | What will you have for the main dish? |
| 170 | 晩ご飯 | ばんごはん | dinner / supper | 晚饭 | 晩(ばん)ご飯(はん)を一緒(いっしょ)に食(た)べませんか？ | Would you like to have dinner together? |
| 171 | だけ | だけ | only / just | 只有 | 一人(ひとり)だけです。 | There is only one person. |
| 172 | かたい | かたい | hard / tough | 硬的 | このパンはかたいです。 | This bread is hard. |
| 173 | シーン | しーん | scene | 场景 | 映画(えいが)のそのシーンが好(す)きです。 | I like that scene in the movie. |
| 174 | ゆか | ゆか | floor | 地板 | ゆかをそうじしました。 | I cleaned the floor. |
| 175 | えんぎ | えんぎ | acting / performance | 表演 | あの俳優(はいゆう)のえんぎはすごいです。 | That actor's performance is amazing. |
| 176 | れつ | れつ | line / queue | 队 | 長(なが)いれつに並(なら)びました。 | I queued in a long line. |
| 177 | おばけやしき | おばけやしき | haunted house | 鬼屋 | おばけやしきはこわいです。 | The haunted house is scary. |
| 178 | 六月 | ろくがつ | June | 六月 | 六月(ろくがつ)は雨(あめ)が多(おお)いです。 | June has a lot of rain. |
| 179 | ゆうえんち | ゆうえんち | amusement park | 游乐园 | 子供(こども)とゆうえんちに行(い)きました。 | I went to the amusement park with my children. |
| 180 | こんでいます | こんでいます | is crowded (progressive) | 拥挤（进行时） | 電車(でんしゃ)がこんでいます。 | The train is crowded. |
| 181 | 今回 | こんかい | this time | 这次 | 今回(こんかい)の旅行(りょこう)は楽(たの)しかったです。 | This trip was enjoyable. |
| 182 | さいあく | さいあく | the worst | 最糟糕 | 今日(きょう)はさいあくな日(ひ)です。 | Today is the worst day. |
| 183 | 七日 | なのか | 7th day / 7 days | 七号 | 七日(なのか)に試験(しけん)があります。 | There is an exam on the 7th. |
| 184 | けんかします | けんかします | to quarrel / fight | 吵架 | 兄弟(きょうだい)とけんかしました。 | I had a fight with my sibling. |
| 185 | さいこう | さいこう | the best / greatest | 最棒 | この映画(えいが)はさいこうです！ | This movie is the best! |
| 186 | 場所 | ばしょ | place / location | 地方 | いい場所(ばしょ)を見(み)つけました。 | I found a great place. |
| 187 | にがて | にがて | poor at / dislike | 不擅长 | 数学(すうがく)がにがてです。 | I am poor at math. |
| 188 | シェフ | しぇふ | chef | 厨师 | このレストランのシェフはゆうめいです。 | The chef at this restaurant is famous. |
| 189 | ベジタリアン | べじたりあん | vegetarian | 素食者 | 私(わたし)はベジタリアンです。 | I am a vegetarian. |
| 190 | オーガニック | おーがにっく | organic | 有机 | オーガニックの野菜(やさい)を買(か)います。 | I buy organic vegetables. |
| 191 | マンション | まんしょん | apartment / condo | 公寓 | 駅(えき)の近(ちか)くのマンションに住(す)んでいます。 | I live in an apartment near the station. |
| 192 | にあります | にあります | is located at | 在（某处） | 図書館(としょかん)は三階(さんかい)にあります。 | The library is on the 3rd floor. |
| 193 | おくじょう | おくじょう | rooftop | 屋顶 | おくじょうからの景色(けしき)がきれいです。 | The view from the rooftop is beautiful. |
| 194 | ふんいき | ふんいき | atmosphere / vibe | 气氛 | このカフェはふんいきがいいです。 | This café has a great atmosphere. |
| 195 | カジュアル | かじゅある | casual | 休闲 | カジュアルな服(ふく)でいいですか？ | Is casual clothing okay? |
| 196 | サイト | さいと | website | 网站 | このサイトはべんりです。 | This website is convenient. |
| 197 | ブラジル料理 | ぶらじるりょうり | Brazilian cuisine | 巴西料理 | ブラジル料理(りょうり)を食(た)べたことがありますか？ | Have you ever eaten Brazilian cuisine? |
| 198 | 日本料理 | にほんりょうり | Japanese cuisine | 日本料理 | 日本料理(にほんりょうり)の中(なか)でお寿司(すし)が好(す)きです。 | Among Japanese cuisine, I like sushi. |
| 199 | 人気 | にんき | popular / popularity | 受欢迎 | このカフェは人気(にんき)があります。 | This café is popular. |
| 200 | かしゅ | かしゅ | singer | 歌手 | 好(す)きなかしゅのコンサートに行(い)きます。 | I'm going to a concert by my favourite singer. |
| 201 | スピーチ | すぴーち | speech | 致辞 | 結婚式(けっこんしき)でスピーチをしました。 | I gave a speech at the wedding. |
| 202 | つまらない | つまらない | boring / dull | 无聊 | この授業(じゅぎょう)はつまらないです。 | This class is boring. |
| 203 | かんどうします | かんどうします | to be moved / touched | 感动 | その映画(えいが)にかんどうしました。 | I was deeply moved by that movie. |
| 204 | ひどい | ひどい | terrible / cruel | 糟糕 | ひどい天気(てんき)ですね。 | The weather is terrible, isn't it. |
| 205 | へん | へん | strange / weird | 奇怪 | へんな音(おと)がします。 | There's a strange sound. |
| 206 | お酒 | おさけ | alcohol / sake | 酒 | お酒(さけ)は飲(の)みません。 | I don't drink alcohol. |
| 207 | ひくい | ひくい | low / short (height) | 低的 | このテーブルはひくいです。 | This table is low. |
| 208 | しんせき | しんせき | relatives | 亲属 | お正月(しょうがつ)にしんせきが来(き)ます。 | Relatives come over at New Year. |
`;

function parseMarkdownTable(md) {
  const lines = md
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const rows = [];
  for (const line of lines) {
    if (!line.startsWith("|")) continue;
    if (line.includes("|---")) continue;

    const cols = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());

    if (cols.length < 7) continue;
    if (cols[0] === "#") continue;

    const [num, jp, hira, en, zh, example, translation] = cols;
    if (!/^\d+$/.test(num)) continue;

    rows.push({
      id: num,
      jp,
      hira,
      en,
      zh,
      cat: "",
      example,
      translation,
    });
  }

  return rows;
}

// =====================
// Persistence keys
// =====================
const LS_SEED = "jp_vocab_seed_v1";
const LS_MEM = "jp_vocab_memorized_v1";
const LS_HIDE = "jp_vocab_hide_memorized_v1";

// =====================
// Deterministic shuffle
// =====================
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed(items, seed) {
  const rng = mulberry32(seed);
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function useIsFullscreen() {
  const [isFs, setIsFs] = useState(false);
  useEffect(() => {
    const onChange = () => setIsFs(Boolean(document.fullscreenElement));
    onChange();
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  return isFs;
}

function ProgressBar({ value01 }) {
  return (
    <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
      <div
        className="h-full rounded-full bg-black/70"
        style={{ width: `${Math.round(value01 * 100)}%` }}
      />
    </div>
  );
}

function Sheet({ open, onClose, title, children }) {
  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div
        className={`absolute left-0 right-0 bottom-0 transition-transform duration-300 ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="mx-auto max-w-lg">
          <div className="rounded-t-3xl bg-white shadow-2xl border border-black/10">
            <div className="px-4 pt-3 pb-2">
              <div className="mx-auto w-10 h-1.5 rounded-full bg-black/15" />
              <div className="flex items-center justify-between mt-3">
                <div className="text-base font-semibold">{title}</div>
                <button
                  onClick={onClose}
                  className="text-sm px-3 py-1.5 rounded-full border border-black/10 hover:bg-black/5"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="px-4 pb-5">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ children, active }) {
  return (
    <div
      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors select-none ${
        active
          ? "bg-black text-white border-black"
          : "bg-white/70 text-black border-black/10"
      }`}
    >
      {children}
    </div>
  );
}

function CardPreview({ card }) {
  if (!card) return null;
  return (
    <div className="absolute inset-0 rounded-3xl bg-white/70 border border-black/10 shadow-sm" />
  );
}

function CardFaceFront({ card, isMemorized }) {
  return (
    <div className="h-full w-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-black/50">#{card.id}</div>
        {isMemorized ? (
          <div className="text-xs font-semibold px-2 py-1 rounded-full bg-black text-white">
            Memorized
          </div>
        ) : (
          <div className="text-xs font-semibold px-2 py-1 rounded-full bg-black/5 text-black/60 border border-black/10">
            Tap for details
          </div>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl leading-tight font-semibold tracking-tight">
            {card.jp}
          </div>
        </div>
      </div>

      <div className="text-xs text-black/40 text-center pb-1">Swipe ← memorized · Swipe → keep</div>
    </div>
  );
}

function CardFaceBack({ card }) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-black/50">#{card.id}</div>
        <div className="text-xs font-semibold px-2 py-1 rounded-full bg-black/5 text-black/60 border border-black/10">
          Tap to hide
        </div>
      </div>

      <div className="mt-4">
        <div className="text-3xl font-semibold leading-tight">{card.jp}</div>
        <div className="mt-2 text-sm text-black/70">
          <span className="font-semibold text-black/80">Reading:</span> {card.hira}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <div className="rounded-2xl border border-black/10 bg-black/5 px-3 py-2">
          <div className="text-xs font-semibold text-black/60">English</div>
          <div className="text-sm">{card.en}</div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-black/5 px-3 py-2">
          <div className="text-xs font-semibold text-black/60">中文</div>
          <div className="text-sm">{card.zh}</div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-black/10 bg-white px-3 py-2">
        <div className="text-xs font-semibold text-black/60">Example</div>
        <div className="text-sm mt-1 leading-relaxed">{card.example}</div>
        <div className="text-xs mt-2 text-black/60">{card.translation}</div>
      </div>

      <div className="mt-auto pt-4 text-xs text-black/40 text-center">Swipe to move on</div>
    </div>
  );
}

export default function App() {
  const cards = useMemo(() => parseMarkdownTable(RAW_VOCAB_MD), []);
  const byId = useMemo(() => {
    const m = new Map();
    for (const c of cards) m.set(c.id, c);
    return m;
  }, [cards]);

  const [seed, setSeed] = useState(() => {
    const fromLs = Number(localStorage.getItem(LS_SEED));
    return Number.isFinite(fromLs) && fromLs > 0 ? fromLs : 123456789;
  });

  const [memorized, setMemorized] = useState(() => {
    const raw = localStorage.getItem(LS_MEM);
    const arr = safeJsonParse(raw || "[]", []);
    return new Set(Array.isArray(arr) ? arr.map(String) : []);
  });

  const [hideMemorized, setHideMemorized] = useState(() => {
    const raw = localStorage.getItem(LS_HIDE);
    return raw === "1";
  });

  const [cursor, setCursor] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dragDir, setDragDir] = useState(null); // 'left' | 'right' | null
  const [lastSwipeDir, setLastSwipeDir] = useState(null);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const isFs = useIsFullscreen();
  const suppressTapRef = useRef(false);

  const fullOrder = useMemo(() => {
    const ids = cards.map((c) => c.id);
    return shuffleWithSeed(ids, seed);
  }, [cards, seed]);

  const activeOrder = useMemo(() => {
    if (!hideMemorized) return fullOrder;
    return fullOrder.filter((id) => !memorized.has(id));
  }, [fullOrder, hideMemorized, memorized]);

  const activeCount = activeOrder.length;
  const done = cursor >= activeCount;

  const currentId = !done ? activeOrder[cursor] : null;
  const nextId = !done ? activeOrder[cursor + 1] : null;

  const current = currentId ? byId.get(currentId) : null;
  const next = nextId ? byId.get(nextId) : null;

  const total = cards.length;
  const memorizedCount = memorized.size;
  const progress01 = total > 0 ? memorizedCount / total : 0;

  useEffect(() => {
    localStorage.setItem(LS_SEED, String(seed));
  }, [seed]);

  useEffect(() => {
    localStorage.setItem(LS_MEM, JSON.stringify(Array.from(memorized)));
  }, [memorized]);

  useEffect(() => {
    localStorage.setItem(LS_HIDE, hideMemorized ? "1" : "0");
    // keep the current card stable if possible
    setCursor((c) => clamp(c, 0, activeOrder.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideMemorized]);

  useEffect(() => {
    // When memorized changes while hiding memorized, cursor might now point past the end.
    if (hideMemorized) setCursor((c) => clamp(c, 0, activeOrder.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memorized, hideMemorized]);

  function markMemorized(id) {
    setMemorized((prev) => {
      const nextSet = new Set(prev);
      nextSet.add(String(id));
      return nextSet;
    });
  }

  function resetMemorized() {
    setMemorized(new Set());
    setCursor(0);
    setFlipped(false);
    setDragDir(null);
  }

  function reshuffle() {
    const newSeed = (Math.floor(Math.random() * 1_000_000_000) ^ Date.now()) >>> 0;
    setSeed(newSeed || 1);
    setCursor(0);
    setFlipped(false);
    setDragDir(null);
  }

  function restartSameOrder() {
    setCursor(0);
    setFlipped(false);
    setDragDir(null);
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // ignore
    }
  }

  function requestSwipe(dir) {
    if (!currentId) return;
    setLastSwipeDir(dir);
    setDragDir(null);

    if (dir === "left") markMemorized(currentId);

    setCursor((c) => c + 1);
    setFlipped(false);
  }

  const exitVariant = (dir) => {
    const w = typeof window !== "undefined" ? window.innerWidth : 400;
    const x = dir === "left" ? -w : w;
    const r = dir === "left" ? -18 : 18;
    return {
      x,
      rotate: r,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.22, ease: "easeOut" },
    };
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-neutral-50 to-neutral-100 text-black">
      <div className="mx-auto max-w-lg min-h-[100dvh] flex flex-col">
        {/* Top bar */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold tracking-tight">日本語 単語帳</div>
            <div className="text-xs text-black/60">
              {memorizedCount}/{total} memorized
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="h-10 w-10 rounded-2xl border border-black/10 bg-white shadow-sm flex items-center justify-center hover:bg-black/5"
              aria-label="Toggle fullscreen"
            >
              {isFs ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setOptionsOpen(true)}
              className="h-10 w-10 rounded-2xl border border-black/10 bg-white shadow-sm flex items-center justify-center hover:bg-black/5"
              aria-label="Open options"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Deck labels */}
        <div className="px-4 mt-1">
          <div className="flex items-center justify-between">
            <Pill active={dragDir === "left"}>← Memorized</Pill>
            <Pill active={dragDir === "right"}>Keep →</Pill>
          </div>
        </div>

        {/* Deck */}
        <div className="flex-1 px-4 pb-6 pt-3 flex items-center justify-center">
          <div className="relative w-full">
            <div className="relative w-full aspect-[3/4] max-h-[70vh]">
              {/* Next card preview */}
              <div className="absolute inset-0 translate-y-2 scale-[0.98]">
                <CardPreview card={next} />
              </div>

              {/* Current card */}
              <AnimatePresence initial={false} custom={lastSwipeDir}>
                {!done && current ? (
                  <motion.div
                    key={current.id}
                    className="absolute inset-0"
                    custom={lastSwipeDir}
                    initial={{ y: 0, x: 0, rotate: 0, opacity: 0, scale: 0.98 }}
                    animate={{ y: 0, x: 0, rotate: 0, opacity: 1, scale: 1 }}
                    exit={(custom) => exitVariant(custom || "right")}
                    transition={{ duration: 0.16 }}
                    drag="x"
                    dragElastic={0.08}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragStart={() => {
                      suppressTapRef.current = true;
                      setTimeout(() => (suppressTapRef.current = false), 120);
                    }}
                    onDrag={(e, info) => {
                      const x = info.offset.x;
                      if (x < -12) setDragDir("left");
                      else if (x > 12) setDragDir("right");
                      else setDragDir(null);
                    }}
                    onDragEnd={(e, info) => {
                      const x = info.offset.x;
                      const threshold = 110;
                      if (x <= -threshold) requestSwipe("left");
                      else if (x >= threshold) requestSwipe("right");
                      else setDragDir(null);
                    }}
                    onClick={() => {
                      if (suppressTapRef.current) return;
                      setFlipped((f) => !f);
                    }}
                  >
                    <div className="h-full w-full rounded-3xl bg-white shadow-2xl border border-black/10 p-4 flex">
                      {!flipped ? (
                        <CardFaceFront card={current} isMemorized={memorized.has(current.id)} />
                      ) : (
                        <CardFaceBack card={current} />
                      )}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* End screen */}
              {done && (
                <div className="absolute inset-0 rounded-3xl bg-white shadow-2xl border border-black/10 p-5 flex flex-col">
                  <div className="text-xl font-semibold">End of deck</div>
                  <div className="mt-2 text-sm text-black/70">
                    {activeCount === 0 && hideMemorized
                      ? "No cards left (Hide memorized is ON)."
                      : "You reached the last card."}
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs text-black/60 mb-2">
                      <div>Memorized</div>
                      <div>
                        {memorizedCount}/{total}
                      </div>
                    </div>
                    <ProgressBar value01={progress01} />
                  </div>

                  <div className="mt-6 grid gap-3">
                    <button
                      onClick={reshuffle}
                      className="w-full rounded-2xl bg-black text-white py-3 font-semibold hover:opacity-95 flex items-center justify-center gap-2"
                    >
                      <Shuffle className="h-5 w-5" /> Shuffle and restart
                    </button>
                    <button
                      onClick={restartSameOrder}
                      className="w-full rounded-2xl border border-black/10 bg-white py-3 font-semibold hover:bg-black/5 flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="h-5 w-5" /> Restart (same order)
                    </button>
                    <button
                      onClick={resetMemorized}
                      className="w-full rounded-2xl border border-black/10 bg-white py-3 font-semibold hover:bg-black/5 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-5 w-5" /> Reset memorized
                    </button>
                  </div>

                  <div className="mt-auto pt-4 text-xs text-black/45">
                    Tip: use Options to toggle “Hide memorized”.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Options sheet */}
        <Sheet open={optionsOpen} onClose={() => setOptionsOpen(false)} title="Options">
          <div className="space-y-4">
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Hide memorized</div>
                  <div className="text-xs text-black/60">
                    If ON, memorized cards are removed from the active deck.
                  </div>
                </div>
                <button
                  onClick={() => setHideMemorized((v) => !v)}
                  className={`h-9 w-16 rounded-full border transition-colors ${
                    hideMemorized ? "bg-black border-black" : "bg-black/10 border-black/10"
                  }`}
                  aria-label="Toggle hide memorized"
                >
                  <div
                    className={`h-7 w-7 rounded-full bg-white shadow-sm transition-transform ${
                      hideMemorized ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="font-semibold">Progress</div>
                <div className="text-black/70">
                  {memorizedCount}/{total}
                </div>
              </div>
              <div className="mt-2">
                <ProgressBar value01={progress01} />
              </div>
            </div>

            <div className="grid gap-3">
              <button
                onClick={() => {
                  reshuffle();
                  setOptionsOpen(false);
                }}
                className="w-full rounded-2xl bg-black text-white py-3 font-semibold hover:opacity-95 flex items-center justify-center gap-2"
              >
                <Shuffle className="h-5 w-5" /> Re-shuffle deck
              </button>

              <button
                onClick={() => {
                  resetMemorized();
                  setOptionsOpen(false);
                }}
                className="w-full rounded-2xl border border-black/10 bg-white py-3 font-semibold hover:bg-black/5 flex items-center justify-center gap-2"
              >
                <Trash2 className="h-5 w-5" /> Reset memorized
              </button>

              <button
                onClick={() => {
                  restartSameOrder();
                  setOptionsOpen(false);
                }}
                className="w-full rounded-2xl border border-black/10 bg-white py-3 font-semibold hover:bg-black/5 flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-5 w-5" /> Restart (same order)
              </button>
            </div>

            <div className="text-xs text-black/50 leading-relaxed">
              Persisted locally: memorized state + shuffle seed.
            </div>
          </div>
        </Sheet>
      </div>
    </div>
  );
}

