var g_chart = new Chart();
var init_state = new State("S",[],decided=false);
g_chart.push(init_state);
var chart_log = [g_chart];

var chord_prog = ["Cmaj7","D7","Dmin7","G7","Cmaj7"];
var sequence_pos = 0;
var current_sequence = [];
var displayID = 0;
var candidate_trees;

console.log(g_chart);

var predict_flag = false;
function init() {
    $('.example').click(function(){     
        $('#txt').val($(this).text());
        $('#txt').trigger('input');
        return false;
    });

    //take the A train
    $('#nav-start-tab').click(function(){
        generate_grammar(true);
        v_nav_cahnge(1);
        analyse_atrain();
    })
    //satin doll
    $('#nav-preparation-tab').click(function(){
        generate_grammar(false);
        v_nav_cahnge(2);
        analyse_satin();
    })
    //key_setting
    $('#key-set-button').click(function(){
        var key = [];
        $('input:checkbox[name="keyCheckBox"]:checked').each(function(){
            key.push($(this).val());
        })
        $('#current-key').text(key);
        set_key(key);
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

    //change display candidate tree 
    $('#inputGroupSelect02').change(function(){
        console.log("change",$(this).val());
        displayID = $(this).val();
        root = d3.hierarchy(displayTree(candidate_trees[displayID]));
        console.log("=========>"+ width);
        root.x0 = width / 2;
        root.y0 = 0;
        svg_init(root);
    });

    // add button
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
        candidate_trees = g_chart.chart;
        console.log("length",candidate_trees.length);
        $('#candidate_num').text(candidate_trees.length);

        $("#inputGroupSelect02").empty();
        for(var i = 0;i < candidate_trees.length;i++){
            $("#inputGroupSelect02").append($("<option>").val(i).text(i+1));
        }
        root = d3.hierarchy(displayTree(candidate_trees[displayID]));
        console.log("=========>"+ width);
        root.x0 = width / 2;
        root.y0 = 0;
        console.log("tree",candidate_trees[displayID]);
        svg_init(root);

        var str = $('#input-txt-area').val();
        current_sequence.push(str)
        console.log(current_sequence);
        $('#display_sequence').text(current_sequence);
        sequence_pos += 1; 
        $('#input-txt-area').val(chord_prog[sequence_pos]);
    });

    //Back One step button
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
        candidate_trees = g_chart.chart// hogehoge
        root = d3.hierarchy(displayTree(candidate_trees[displayID]));
        console.log("=========>"+ width);
        root.x0 = width / 2;
        root.y0 = 0;
        console.log("tree",candidate_trees[displayID]);
        svg_init(root);
    })
    
    //clear all chord Button
    $('#clear-all-button').on('click',function(){
        current_sequence = [];
        $('#display_sequence').text(" --show chord sequence in this area--");
        g_chart = new Chart();
        init_state = new State("S",[],decided=false);
        $('#input-txt-area').val(chord_prog[0]);
        g_chart.push(init_state);
        chart_log = [g_chart];
        sequence_pos = 0;
        $('.svg').empty();
        
    })


    //navigation bar
    //A train 
    $('#v-pills-a-train').on('click',function(){
        h_nav_change(1);
        generate_grammar(true);
        analyse_atrain();
    })

    //Satin Doll
    $('#v-pills-satin').on('click',function(){
        h_nav_change(2);
        generate_grammar(false);
        analyse_satin();
    })

    //Autumn leaves
    $('#v-pills-autumn-leaves').on('click',function(){
        chord_prog = ["Cmin7","F7","Bbmaj7","Ebmaj7","Ahdim","D7","Gmin7"];
        current_sequence = [];
        $('#display_sequence').text(" ---show chord sequence in this area---");
        g_chart = new Chart();
        init_state = new State("S",[],decided=false);
        $('#input-txt-area').val(chord_prog[0]);
        g_chart.push(init_state);
        chart_log = [g_chart];
        sequence_pos = 0;
        $('.svg').empty();
    })

    //Custom songs
    $('#v-pills-custom-songs').on('click',function(){
        chord_prog = [];
        current_sequence = [];
        $('#display_sequence').text(" ---show chord sequence in this area---");
        g_chart = new Chart();
        init_state = new State("S",[],decided=false);
        $('#input-txt-area').val("");
        g_chart.push(init_state);
        chart_log = [g_chart];
        sequence_pos = 0;
        $('.svg').empty();
    })
}

function analyse_satin(){
    $('#candidate_num').text(0)
    chord_prog = ["Dmin7","G7","Emin7","A7","Amin7","D7","G#min7","C#7","Cmaj7"];
    current_sequence = [];
    $('#display_sequence').text(" ---show chord sequence in this area---");
    g_chart = new Chart();
    init_state = new State("S",[],decided=false);
    $('#input-txt-area').val(chord_prog[0]);
    g_chart.push(init_state);
    chart_log = [g_chart];
    sequence_pos = 0;
    $('.svg').empty();
}

function analyse_atrain(){
    $('#candidate_num').text(0)
    chord_prog = ["Cmaj7","D7","Dmin7","G7","Cmaj7"];
    current_sequence = [];
    $('#display_sequence').text(" ---show chord sequence in this area---");
    g_chart = new Chart();
    init_state = new State("S",[],decided=false);
    $('#input-txt-area').val(chord_prog[0]);
    g_chart.push(init_state);
    chart_log = [g_chart];
    sequence_pos = 0;
    $('.svg').empty();
}

function h_nav_change(i){
    switch(i){
        case 1:
        $('#nav-start-tab').attr('aria-selected',true);
        $('#nav-start-tab').attr('class',"nav-item nav-link h5 active");
        $('#nav-start').attr('class',"tab-pane active");
        $('#nav-preparation-tab').attr('aria-selected',false);
        $('#nav-preparation-tab').attr('class',"nav-item nav-link h5");
        $('#nav-preparation').attr('class',"tab-pane");
        break;
        case 2:
        $('#nav-start-tab').attr('aria-selected',false);
        $('#nav-start-tab').attr('class',"nav-item nav-link h5");
        $('#nav-start').attr('class',"tab-pane");
        $('#nav-preparation-tab').attr('aria-selected',true);
        $('#nav-preparation-tab').attr('class',"nav-item nav-link h5 active");
        $('#nav-preparation').attr('class',"tab-pane active");
        break;

    }
}

function v_nav_cahnge(i){
    switch(i){
        case 1:
        $('#v-pills-a-train').attr('aria-selected',true);
        $('#v-pills-a-train').attr('class',"nav-link active");
        $('#v-pills-satin').attr('aria-selected',false);
        $('#v-pills-satin').attr('class',"nav-link");
        break;
        case 2:
        $('#v-pills-a-train').attr('aria-selected',false);
        $('#v-pills-a-train').attr('class',"nav-link");
        $('#v-pills-satin').attr('aria-selected',true);
        $('#v-pills-satin').attr('class',"nav-link active");
        break;

    }
}
