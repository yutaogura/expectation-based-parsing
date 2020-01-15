# Incremental Parsing of Jazz Chord Sequence

## Note
- min **6** pages ~ max **8** pages

## Paragraph
0. ABSTRACT 
    - 150~200 words
1. INTRODUCTION
    - 楽曲は階層的であり，木構造をなす．Rhormeierの解析法は一度に楽曲全体が与えられることを前提としている．
    > 楽曲の構造は階層的であり，木構造のように表すことができる. 計算論的音楽理論の代表的理論である GTTM[1] では，音楽を聴取した人が木構造を階層的に構成すること によって音楽を理解すると主張している.また，Rhormeir らは楽曲の和声進行についての句構造文法規則を定めるこ とで，和声進行を階層的・生成的に説明する手法を提案し ている [2].これらの手法は，一度に楽曲全体が与えられる という前提のもと解析を行っている.
    - 人は漸進的に，時間軸に剃って楽曲構造を理解している．漸進的な構文解析手法は新たな応用への基礎となりうる．
    > 一方で，我々が実際に音楽を聴取し，理解する時のこと を考えると，楽譜のように一度に楽曲全体が与えられると いうことはないため，時間軸に伴って漸進的に楽曲の構造 を理解していると考えられる.我々は常に次の音を予測し て音楽を聴取し，意味づけをすることによって音楽をゲ シュタルト的に理解しているとも言える.しかしながら， 既存の音楽理論は楽曲全体が一度に入力されるものとする ことが多く，静的な解析にとどまっている.漸進的に音楽 の構文を解析し，その時点での楽曲構造の解析結果や次の 展開の予測などができれば，自動セッションシステムのよ うなリアルタイム性の高い応用分野への足掛かりにもなる と考えられる. 実際に，自然言語の分野においては漸進的 構文解析の研究がなされており，同時通訳や字幕生成など に利用されている.
    - 本稿では，ジャズのコード進行に対して漸進的な構文解析を行う．本手法をWEBシステムに実装した．
    > そこで本稿では，楽曲を構成する様々な要素の中でも コードとコード進行に着目し，その構造解析を漸進的に行 う新しい手法を提案する.コード進行の規則が文脈自由言 語のクラスに属すると仮定し，コード進行について既に音 1
楽理論的に様々な解析が行われているジャズの楽曲を題 材として漸進的な解析を行った.また本手法を利用して， コードが認識(入力)されるごとに，その時点までのコー ド進行の解析結果と，次に予測されるコードまたは構造を 表示するインタラクティブな web システムを実装した.

1. GRAMMATICAL MODELS FOR JAZZ CHORD SEQUENCE

    1. abstract context free grammars

        Daniel Harasim & Rohrmeierの論文について説明

    1. a generative syntax of jazz harmony

        採用したコード書き換えルールについて説明
        - prolongation
        - diatonic preparation
        - dominant preparation
        - plagal preparation
        - modulation
        - mode change
        - diatonic substitution
        - dominant substitution
        


1. INCREMENTAL PARSING 
    1. earley algorithm

    1. incremental parsing 

    1. inference of next chord sequence

1. IMPLEMENTATION

    実装したwebアプリケーションについて説明する

1. SAMPLE ANALYSIS and DISCUSSION

    1. sample analysis 
        1. take the A train
        1. Satin Doll

    1. Discussion   


1. CONCLUSION
    結論

