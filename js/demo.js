var predict_flag = false;

function init() {

    $('.example').click(function(){     
        $('#txt').val($(this).text());
        $('#txt').trigger('input');
        return false;
    });

    function displayTree(tree) {
        //console.log("===display Tree==")
        //サブツリーがない場合
        if (!tree.subtrees || tree.subtrees.length == 0) {
            //console.log(JSON.stringify({"name" : tree.root}));
            var builder = {};
            builder["name"] = tree.root;
            return builder;
        }
        //普通の時
        var builder = {};
        builder["name"] = tree.root;
        builder["children"] = [];
        for (var i in tree.subtrees) {
            builder["children"].push(displayTree(tree.subtrees[i]))
        }
        return builder;
    }
    function display_predictTree(tree,predict) {
        if (!tree.subtrees || tree.subtrees.length == 0) {
            //console.log(JSON.stringify({"name" : tree.root}));
            var builder = {};
            builder["name"] = tree.root;
            return builder;
        }
        var builder = {};
        builder["name"] = tree.root;
        builder["children"] = [];
        for (var i in tree.subtrees) {
            builder["children"].push(displayTree(tree.subtrees[i]))
        }
        var predict_build = {};
        predict_build["name"] = predict;
        console.log(predict);
        builder["children"].push(predict_build);
        return builder;
    }

    var form = document.forms.myform;

    form.myfile.addEventListener( 'change', function(e) {
     
        var result = e.target.files[0];
     
        //FileReaderのインスタンスを作成する
        var reader = new FileReader();
      
        //読み込んだファイルの中身を取得する
        reader.readAsText( result );
      
        //ファイルの中身を取得後に処理を行う
        reader.addEventListener( 'load', function() {
        
            //ファイルの中身をtextarea内に表示する
            form.output.textContent = reader.result;    
        })
     
    })

    var tree_array = [];

    $('#txt').bind('input', function() {
        predict_flag = false;
        var s = $(this).val();
        var tokenStream = s.trim().split(' ');

        var rules = $('#grm').val().trim().split('\n')
        
        var grammar = new tinynlp.Grammar(rules);
        
        var rootProduction = 'S';
        var chart = tinynlp.parse(tokenStream, grammar, rootProduction); 

        var state = chart.getFinishedRoot(rootProduction);
        console.log("これが本当に完了した状態"+state);
        var pre_state = chart.getCompleteState();
        console.log("これがとりあえず完了した状態");
        for(var i in pre_state){
            console.log(pre_state[i].toString());
        }
        // if (state) {
        //     console.log("state:" + state);
        //     var trees = state.traverse();
        //     $('#dv').empty();
        //     for (var i in trees) {
        //         console.log(JSON.stringify(trees[i]))
        //         $('#dv').append('<div class="tree" id="displayTree"><ul>' + displayTree(trees[i]) + '</ul></div></br>');
        //     }
        // }
        $('#dv').empty();
        var number_of_trees = 0;
        tree_array = [];
        for(var k in pre_state){
            var trees = pre_state[k].traverse();
            console.log(trees[0].root) //rootがSの物だけ木を描画する
            if (trees[0].root == 'S') {
                for (var i in trees) {
                    number_of_trees++;
                    //console.log(JSON.stringify(trees[i]))
                    console.log(displayTree(trees[i]));
                    root = d3.hierarchy(displayTree(trees[i]));
                    root.x0 = width / 2;
                    root.y0 = 0;
                    tree_array.push(root);
                }
            }
        }
        console.log("tree",tree_array[0]);
        //TODO:　2つ以上木が出来る時どう表示するか？
        if(number_of_trees > 0){
            svg_init(tree_array[0]);
            console.log(number_of_trees);
            $('#num').val(number_of_trees);
            document.getElementById('display_tree_num').value = 1;
            document.getElementById('display_tree_num').min = 1;
            document.getElementById('display_tree_num').max = number_of_trees;
        }else{
            console.log(number_of_trees);
            $('#num').val(number_of_trees);
            document.getElementById('display_tree_num').max = number_of_trees;
        }

    });



    $('#predict').on('click',function(){
        predict_flag = true;
        var s = $('#txt').val();
        var tokenStream = s.trim().split(' ');
        var rules = $('#grm').val().trim().split('\n')
        var grammar = new tinynlp.Grammar(rules);
        var rootProduction = 'S';
        var tiny = tinynlp;
        tiny.logging(false);
        var chart = tiny.parse(tokenStream, grammar, rootProduction); 
        
        var prediction_state = chart.getPredictionState();
        console.log("これが予測される状態");
        for(var i in prediction_state){
            console.log(prediction_state[i].toString());
        }
        $('#dv').empty();
        tree_array = [];
        var number_of_trees = 0;
        for(var k in prediction_state){
            if (prediction_state[k]) {
                var trees = prediction_state[k].traverse();
                var predict = prediction_state[k].rhs;
                console.log("これが右"+predict[predict.length - 1]);
                for (var i in trees) {
                    number_of_trees++;
                    console.log(trees[i].subtrees);
                    console.log(JSON.stringify(trees[i]))
                    root = d3.hierarchy(display_predictTree(trees[i],predict[predict.length - 1]));
                    root.x0 = width / 2;
                    console.log(root.x0);
                    root.y0 = 0;
                    tree_array.push(root);
                    //$('#dv').append('<div class="tree" id="displayTree"><ul>' + display_predictTree(trees[i],predict[predict.length - 1]) + '</ul></div></br>');
                }
            }
        }
        if(number_of_trees > 0){
            svg_init(root);
            console.log(number_of_trees);
            $('#num').val(number_of_trees);
            document.getElementById('display_tree_num').max = number_of_trees;
        }else{
            console.log(number_of_trees);
            $('#num').val(number_of_trees);
            document.getElementById('display_tree_num').max = number_of_trees;
        }

    });
    
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
