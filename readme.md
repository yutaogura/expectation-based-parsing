# Incremental Parsing of Jazz Chord Sequence

## Note
- min **6** pages ~ max **8** pages
- application page -> https://yutaogura.github.io/incremental_parsing/
## Paragraph
0. ABSTRACT 
    - 150~200 words
1. INTRODUCTION
    - 楽曲は階層的であり，木構造をなす．Rhormeierの解析法は一度に楽曲全体が与えられることを前提としている．
    > 楽曲の構造は階層的であり，木構造のように表すことができる[GTTM]これまで，楽曲のコード進行を階層的にモデル化することで，隣り合うor距離の離れたコード同士の関係を明らかにしようという研究が計算論的音楽理論ではなされてきた[Steedman,Rohrmeier].これらの手法は，一度に楽曲全体が与えられるという前提のもと解析を行っている.
    - 人は漸進的に，時間軸にそって楽曲構造を理解している．漸進的な構文解析手法は新たな応用への基礎となりうるだろう．
    > 一方で，我々が実際に音楽を聴取し，理解する時のことを考えると，楽譜のように一度に楽曲全体が与えられるということはないため，時間軸に伴って漸進的に楽曲の構造を理解していると考えられる.我々は常に次の音を予測して音楽を聴取し，意味づけをすることによって音楽をゲシュタルト的に理解しているとも言える.しかしながら，既存の音楽理論は楽曲全体が一度に入力されるものとすることが多く，静的な解析にとどまっている.漸進的に音楽の構文を解析し，その時点での楽曲構造の解析結果や次の展開の予測などができれば，自動セッションシステムのよ うなリアルタイム性の高い応用分野への足掛かりにもなると考えられる. 実際に，自然言語の分野においては漸進的構文解析の研究がなされており，同時通訳や字幕生成などに利用されている.
    - 本稿では，ジャズのコード進行に対して漸進的な構文解析を行う．本手法をWEBシステムに実装した．
    > そこで本稿では，楽曲を構成する様々な要素の中でも コードとコード進行に着目し，その構造解析を漸進的に行う新しい手法を提案する.コード進行の規則が文脈自由言語のクラスに属すると仮定し，コード進行について既に音楽理論的に様々な解析が行われているジャズの楽曲を題材として漸進的な解析を行った.また本手法を利用して，コードが認識(入力)されるごとに，その時点までのコード進行の解析結果と,次に予測されるコードまたは構造を表示するインタラクティブなwebシステムを実装した.

1. GRAMMATICAL MODELS FOR JAZZ CHORD SEQUENCE
    
    ジャズのコード進行を題材とした階層的な解析方法としてはHarasimらのものがある[Harasim].本研究では，この手法をもとに漸進的な解析を行う．ここでは，Abstract Context-Free Grammar(ACFG)と採用したコード書き換え規則について説明する．

    1. abstract context free grammars

        Daniel HarasimらのACFGについて説明

    1. a generative syntax of jazz harmony

        採用したコード書き換え規則について説明
        - prolongation
        - diatonic preparation
        - dominant preparation
        - plagal preparation
        - modulation
        - mode change
        - diatonic substitution
        - dominant substitution
        


1. INCREMENTAL PARSING 
    
    漸進的構文解析の手法を説明する
    1. earley algorithm

        アーリーアルゴリズムについて説明

    1. incremental parsing 
        
        漸進的に解析するために，一つのコードが入力されるごとに解析を行うことに言及

    1. inference of subsequent harmony structure

        アーリー法で解析をする中で求めることができる後続の和声構造を表示

1. IMPLEMENTATION

    実装したwebアプリケーションについて説明する
    https://yutaogura.github.io/incremental_parsing/

1. SAMPLE ANALYSIS and DISCUSSION

    1. sample analysis 

        解析楽曲の例2つ(1つにするかも)
        1. take the A train
            - 木の候補が入力の段階によって動的に変わること
            - 予測が正しく行われていること
            - 途中で非文となり，解析が不可能になりうること
        1. Satin Doll

    1. Discussion   
        - 非文の取扱い
        - 様相論理を用いた理論化
        - 書き換え規則の妥当性，変更するとどうなるか


1. CONCLUSION
    - [Harasim,Rohrmeier]らの論文をもとに，楽曲の和声構造を漸進的に解析する手法を考案した
    - 上記の手法をwebシステムとして実装して，いくつかの楽曲で確認した
    - (future work) 様相論理を用いた理論化，書き換え規則の妥当性の検証，コードの長さ（タイムスパン）を組み込む
    - (application) 自動セッションシステムのようなインタラクティブに解析を必要とする応用製品に使えるかもしれない

