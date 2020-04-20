var g_chart = new Chart();
var init_state = new State("S",[],decided=false);
g_chart.push(init_state);
var chart_log = [g_chart];

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

    var tree_array = [];

    $('#add-button').bind('click', function() {
        
        predict_flag = false;
        var s = $(this).val();
        console.log("key",sequence_pos,chart_log.length);
        if(chart_log.length == sequence_pos+1){ 
            g_chart = chart_parsing(g_chart,chord_prog[sequence_pos]); 
            chart_log.push(g_chart); 
        }else{
            g_chart = chart_log[sequence_pos];
        } 

        $('#dv').empty();
        var number_of_trees = 0;
        tree_array = [];
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
            svg_init(tree_array[0]);
            console.log(number_of_trees);
            $('#num').val(number_of_trees);
        }else{
            predict_flag = true;
        }

        var str = $('#input-txt-area').val();
        current_sequence.push(str)
        console.log(current_sequence);
        $('#display_sequence').text(current_sequence);
        sequence_pos += 1; 
        $('#input-txt-area').val(chord_prog[sequence_pos]);
    });

    $('#back-button').on('click',function(){
        current_sequence.pop();
        $('#display_sequence').text(current_sequence);
        if(sequence_pos > 0){
            sequence_pos -= 1;
            $('#input-txt-area').val(chord_prog[sequence_pos]);
            g_chart = chart_log[sequence_pos];
            chart_log.pop();
        }else{
            g_chart = chart_log[0];
        }    

        predict_flag = false;
        var s = $(this).val();   
        $('#dv').empty();
        var number_of_trees = 0;
        tree_array = [];
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
            svg_init(tree_array[0]);
            console.log(number_of_trees);
            $('#num').val(number_of_trees);
        }else{
            predict_flag = true;
        }
    })

    $('#clear-all-button').on('click',function(){
        current_sequence = [];
        $('#display_sequence').text("--display here--");
        g_chart = new Chart();
        init_state = new State("S",[],decided=false);
        $('#input-txt-area').val(chord_prog[0]);
        g_chart.push(init_state);
        chart_log = [g_chart];
        sequence_pos = 0;
        $('.svg').empty();
        
    })

    $('#post').on('click',function(){
        var now =  Number(document.getElementById('display_tree_num').value);
        if(now < document.getElementById('display_tree_num').max ){
            document.getElementById('display_tree_num').value = now + 1;
            svg_init(tree_array[now]);
        }
    })
}
