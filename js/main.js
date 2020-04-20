var g_chart = new Chart();
var init_state = new State("S",[],decided=false);
g_chart.push(init_state);
const chord_prog = ["Dmin7","G7","Emin7","A7","Amin7","D7","Abmin7","Db7","Cmaj7"]
var sequence_pos = 0;
var current_sequence = [];

console.log(g_chart);

var predict_flag = false;
function init() {
    $('.example').click(function(){     
        $('#txt').val($(this).text());
        $('#txt').trigger('input');
        return false;
    });


    //木の表示
    function displayTree(tree) {
        console.log("===display Tree==")
        console.log(tree);
        //サブツリーがない場合
        if (!tree.content || tree.content.length == 0) {
            //console.log(JSON.stringify({"name" : tree.category}));
            var builder = {};
            builder["name"] = tree.category;
            return builder;
        }
        //普通の時
        var builder = {};
        builder["name"] = tree.category;
        builder["children"] = [];
        for (var i in tree.content) {
            console.log(tree.content[i])
            if(tree.content[i]){
                builder["children"].push(displayTree(tree.content[i]))
            }
        }
        return builder;
    }

    // function display_predictTree(tree,predict) {
    //     if (!tree.content || tree.content.length == 0) {
    //         //console.log(JSON.stringify({"name" : tree.category}));
    //         var builder = {};
    //         builder["name"] = tree.category;
    //         return builder;
    //     }
    //     var builder = {};
    //     builder["name"] = tree.category;
    //     builder["children"] = [];
    //     for (var i in tree.content) {
    //         builder["children"].push(displayTree(tree.content[i]))
    //     }
    //     var predict_build = {};
    //     predict_build["name"] = predict;
    //     //console.log(predict);
    //     builder["children"].push(predict_build);
    //     return builder;
    // }

    //文法設定ファイル読み込み
    // var form = document.forms.myform;
    // form.myfile.addEventListener( 'change', function(e) {
     
    //     var result = e.target.files[0];
     
    //     //FileReaderのインスタンスを作成する
    //     var reader = new FileReader();
      
    //     //読み込んだファイルの中身を取得する
    //     reader.readAsText( result );
      
    //     //ファイルの中身を取得後に処理を行う
    //     reader.addEventListener( 'load', function() {
        
    //         //ファイルの中身をtextarea内に表示する
    //         form.output.textContent = reader.result;    
    //     })
     
    // })

    var tree_array = [];

    $('#add-button').bind('click', function() {
        predict_flag = false;
        var s = $(this).val();
        g_chart = chart_parsing(g_chart,chord_prog[sequence_pos]);    
        //文法読み込み
        // var rules = $('#grm').val().trim().split('\n')
        
        // var grammar = new tinynlp.Grammar(rules);
        
        // var categoryProduction = 'S';
        // var chart = tinynlp.parse(tokenStream, grammar, categoryProduction); 

        // var state = chart.getFinishedcategory(categoryProduction);
        // console.log("complete","左辺ルートかつ完了した状態");
        // console.log("complete",state);
        // console.log("complete","完了した状態");
        // var pre_state = chart.getCompleteState();　

        // for(var i in pre_state){
        //     console.log("complete",pre_state[i].toString());
        // }


        $('#dv').empty();
        var number_of_trees = 0;
        tree_array = [];
        // <-----
        // for(var k in pre_state){
        //     //console.log("hoge",pre_state[k]);
        //     var trees = pre_state[k].traverse();
        //     //console.log(trees[0].category) //categoryがSの物だけ木を描画する
        //     if (trees[0].category == 'S') {
        //         for (var i in trees) {
        //             number_of_trees++;
        //             //console.log(JSON.stringify(trees[i]))
        //             //console.log(displayTree(trees[i]));
        //             category = d3.hierarchy(displayTree(trees[i]));
        //             category.x0 = width / 2;
        //             category.y0 = 0;
        //             tree_array.push(category);
        //         }
        //     }
        // }
        // ---->

        var tree = g_chart.chart// hogehoge
        console.log(g_chart);
        number_of_trees = 1;
        root = d3.hierarchy(displayTree(tree[0]));
        console.log("=========>"+ width);
        root.x0 = width / 2;
        root.y0 = 0;
        tree_array.push(root);
        console.log("tree",tree_array[0]);


        if(number_of_trees > 0){
            //document.getElementById("tension").innerText = "stable tree"
            svg_init(tree_array[0]);
            console.log(number_of_trees);
            $('#num').val(number_of_trees);
            // document.getElementById('display_tree_num').value = 1;
            // document.getElementById('display_tree_num').min = 1;
            // document.getElementById('display_tree_num').max = number_of_trees;
        }else{
            predict_flag = true;
            //document.getElementById("tension").innerText = "unstable tree"
            //var scanned = chart.getScannedState();
            //console.log("unstable",scanned);
            // var number_of_trees = 0;
            // tree_array = [];
            // for(var k in scanned){
            //     console.log("semi_complete",scanned[k].id);
            //     var trees = scanned[k].makeTree();
            //     var predict = scanned[k].rhs;
            //     //console.log("これが右"+predict[predict.length - 1]);
            //     console.log("unstable",trees) 
            //         for (var i in trees) {
            //             number_of_trees++;
            //             //console.log(JSON.stringify(trees[i]))
            //             console.log(displayTree(trees[i]));
            //             root = d3.hierarchy(displayTree(trees[i]));
            //             root.x0 = width / 2;
            //             root.y0 = 0;
            //             tree_array.push(root);
            //         }
            // }
            //svg_init(tree_array[0]);
            //console.log(number_of_trees);
            //$('#num').val(number_of_trees);
            //document.getElementById('display_tree_num').max = number_of_trees;
        }

    });



    // $('#predict').on('click',function(){
    //     predict_flag = true;
    //     var s = $('#txt').val();
    //     var tokenStream = s.trim().split(' ');
    //     var rules = $('#grm').val().trim().split('\n')
    //     var grammar = new tinynlp.Grammar(rules);
    //     var rootProduction = 'S';
    //     var tiny = tinynlp;
    //     tiny.logging(false);
    //     var chart = tiny.parse(tokenStream, grammar, rootProduction); 
        
    //     var prediction_state = chart.getPredictionState();
    //     console.log("complete","予測される部分木");
    //     for(var i in prediction_state){
    //         console.log("complete",prediction_state[i].toString());
    //     }
    //     $('#dv').empty();
    //     tree_array = [];
    //     var number_of_trees = 0;
    //     for(var k in prediction_state){
    //         if (prediction_state[k]) {
    //             var trees = prediction_state[k].traverse();
    //             var predict = prediction_state[k].rhs;
    //             console.log("これが右"+predict[predict.length - 1]);
    //             for (var i in trees) {
    //                 number_of_trees++;
    //                 console.log(trees[i].content);
    //                 console.log(JSON.stringify(trees[i]))
    //                 root = d3.hierarchy(display_predictTree(trees[i],predict[predict.length - 1]));
    //                 root.x0 = width / 2;
    //                 console.log(root.x0);
    //                 root.y0 = 0;
    //                 tree_array.push(root);
    //             }
    //         }
    //     }
    //     if(number_of_trees > 0){
    //         svg_init(root);
    //         console.log(number_of_trees);
    //         $('#num').val(number_of_trees);
    //         document.getElementById('display_tree_num').max = number_of_trees;
    //     }else{
    //         console.log(number_of_trees);
    //         $('#num').val(number_of_trees);
    //         document.getElementById('display_tree_num').max = number_of_trees;
    //     }

    // });
    
   $('#add-button').bind('click',function(){
       var str = $('#input-txt-area').val();
       current_sequence.push(str)
       console.log(current_sequence);
       $('#display_sequence').text(current_sequence);
       sequence_pos += 1; 
       $('#input-txt-area').val(chord_prog[sequence_pos]);
   })

    $('#display_tree_num').bind('input', function() {
        var number = $('#display_tree_num').val();
        console.log(number-1, tree_array);
        svg_init(tree_array[number - 1]);
    })

    $('#pre').on('click',function(){
        var now =  Number(document.getElementById('display_tree_num').value);
        if(now > document.getElementById('display_tree_num').min ){
            document.getElementById('display_tree_num').value = now - 1;
            svg_init(tree_array[now - 2]);
        }
    })
    $('#post').on('click',function(){
        var now =  Number(document.getElementById('display_tree_num').value);
        if(now < document.getElementById('display_tree_num').max ){
            document.getElementById('display_tree_num').value = now + 1;
            svg_init(tree_array[now]);
        }
    })
}
