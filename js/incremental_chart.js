

let CATEGORY =　["S"];
let LEXICON = {};
let Grammar = [];

const chord_type = ["maj7","min7","7","hdim7"];
const chroma=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const degree=["I","II","III","IV","V","VI","VII"];

function set_key(keys){
   console.log(keys);
}

function generate_category(){
    var str = ""
    for(var i=0;i<chroma.length;i++){
        for(var j=0;j<degree.length;j++){
            str = degree[j] + "_" + chroma[i];
            CATEGORY.push(str);
        }
    }
}

function generate_lexicon(){
    var chord_name;
    var degree_name;
    for(var i=0;i<chroma.length;i++){
        for(var j= 0;j<chord_type.length;j++){
            chord_name = "";
            degree_name = []
            switch(chord_type[j]){
                case "maj7":
                    chord_name = chroma[i] + chord_type[j];    // Cmaj7=
                    degree_name.push("I_"+chroma[i]);          //I_C   
                    degree_name.push("IV_"+chroma[(i+7)%12]);  //IV_G  
                    LEXICON[chord_name] = degree_name;
                    break;
                case "min7":
                    chord_name = chroma[i] + chord_type[j];    //Cmin7=
                    degree_name.push("II_"+chroma[(i+10)%12]); //II_A#
                    degree_name.push("III_"+chroma[(i+8)%12]); //III_G#
                    degree_name.push("VI_"+chroma[(i+3)%12]);  //VI_D#
                    LEXICON[chord_name] = degree_name;
                    break;
                case "7":
                    chord_name = chroma[i] + chord_type[j];   //C7=
                    degree_name.push("V_"+chroma[(i+5)%12]); //V_F
                    LEXICON[chord_name] = degree_name;
                    break;
                case "hdim7":
                    chord_name = chroma[i] + chord_type[j];   //Chdim7=
                    degree_name.push("VII_"+chroma[(i+1)%12]); //VII_C#
                    LEXICON[chord_name] = degree_name;
                    break;
            }
        }
    }
}

function generate_grammar(){
    var start_rules = generate_start_rule();
    Grammar = Grammar.concat(start_rules);
    var prep_rules = generate_preparation_rule();
    Grammar = Grammar.concat(prep_rules);
    // var replace_rules = generate_replace_rule();
    // Grammar = Grammar.concat(replace_rules);
}

function generate_start_rule(){
    var rules = [];
    for(var i=0;i<chroma.length;i++){
        rules.push(new Rule("S",["I_" + chroma[i]]))
    }
    return rules;
}

function generate_preparation_rule(){
    var rules = [];
    for(var i=0;i<chroma.length;i++){
        rules.push(new Rule("I_"+chroma[i],["V_" + chroma[i],"I_" + chroma[i]]));
        rules.push(new Rule("V_"+chroma[i],["II_" + chroma[i],"V_" + chroma[i]]));
        rules.push(new Rule("I_"+chroma[i],["I_" + chroma[i],"I_" + chroma[i]]));
        rules.push(new Rule("V_"+chroma[i],["V_" + chroma[(i+7)%12],"V_" + chroma[i]]));
    }
    return rules;
}

function generate_replace_rule(){
    var rules = [];
    for(var i=0;i<chroma.length;i++){
        rules.push(new Rule("V_"+chroma[i],["V_" + chroma[(i+6)%12]]));
    }
    return rules;
}


class Rule {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
    print_rule() {
        return this.left + " -> " + this.right;
    }
}

class State {
    constructor(category, content, decided = true, id = 0) {
        this.category = category;
        this.content = content;
        this.decided = decided;
        this.id = id;
    }
    setId(id) {
        this.id = id;
    }
    print_state(str = "") {
        var tot = "";
        if (this.content.length == 0) {
            if (this.decided == true) {
                tot = this.category;
            } else {
                tot = this.category + "\n" + str + "|- ?"
            }
        }
        else {
            tot = this.category;
            for (let i = 0; i<this.content.length; i++) {
                tot = tot + "\n" + str + "|-" + this.content[i].print_state((str + " "));
            }
        }
        return tot;
    }
    print_id() {
        return this.id;
    }
    lvt(temp = "") {
        if (this.content.length == 0) {
            if (this.decided == false) {
                if (temp == "") {
                    return this.category;
                } else {
                    return temp;
                }
            } else {
                return "";
            }
        }
        for (let i = 0; i<this.content.length; i++) {
            temp = this.content[i].lvt(temp);
        }
        return temp;
    }
    replace(term, flag = true) {
        // console.log("==>")
        // console.log(term.content);
        if (this.content.length == 0) {
            if (this.decided == false && flag) {
                this.content = term.content;
                this.decided = true;
                return false;
            }
        }
        for (let i = 0; i < this.content.length; i++) {
            flag = this.content[i].replace(term, flag);
        }
        return flag;
    }
}
class Chart {
    constructor() {
        this.chart = [];
        this.number = 1;
    }

    push(state) {
        this.chart.push(state);
        state.setId(this.number);
        this.number += 1;
    }
    print_chart() {
        for (let i= 0; i<this.chart.length; i++){
            var moji = "(" + this.chart[i].print_id() + ")\n" + this.chart[i].print_state();
            //木を表示する
            console.log(moji);
        }
    }
    get_chart() {
        return this.chart;
    }

}

//
// main関数 
// 

generate_category();
generate_lexicon();
generate_grammar();

//console.log(CATEGORY);
//console.log(LEXICON);
// var Grammar = [
//     new Rule("S", ["I_C"]),
//     new Rule("I_C", ["V_C", "I_C"]),
//     new Rule("I_C", ["I_C", "I_C"]),
//     new Rule("V_C", ["II_C", "V_C"]),
//     new Rule("V_C", ["V_G", "V_C"]),
//     new Rule("V_C", ["V_F#"]),
//     new Rule("V_F#", ["II_F#", "V_F#"]),
//     new Rule("V_G", ["II_G", "V_G"]),
//     new Rule("V_G", ["V_D", "V_G"]),
//     new Rule("V_D", ["II_D", "V_D"])]

console.log("==print_grammar==")
for(let i = 0; i < Grammar.length; i++){
    console.log(Grammar[i].print_rule())
}

function chart_parsing(global_chart,w){
    var local_chart = new Chart();
    var temp = new Chart();

    console.log("====init====");
    console.log("==== " + w + " was inputed =====");

    //lexicon consultation
    console.log("==step1==")
    for(var i =0; i< CATEGORY.length;i++){
        for(var j=0;j < LEXICON[w].length;j++){
            if(CATEGORY[i] == LEXICON[w][j]){
                console.log("lexicon",CATEGORY[i]);
                local_chart.push(new State(CATEGORY[i],[new State(w,[])]));
            }
        }
    }
    local_chart.print_chart();

    //rule application
    console.log("===step2===");
    var left_rec_flag = false;
    var nukeru = false;
    var state_set_local = local_chart.get_chart();
    for(let i = 0;i<state_set_local.length;i++){
        console.log("step2",state_set_local[i]);
        for(let j = 0;j<Grammar.length;j++){
            var g = Grammar[j];
            if(g.right[0] == state_set_local[i].category){
                console.log("step2(match)",g);
                var subseq = [state_set_local[i]];
                var slice = g.right.slice(1);
                for(let k = 0; k<slice.length;k++){
                    var right = slice[k]; //check
                    subseq.push(new State(right,[],decided = false))
                }
                var new_state = new State(g.left,subseq);
                local_chart.push(new_state);
                //console.log("step2",JSON.parse(JSON.stringify(new_state)));
                //左再帰ルールかどうか？
                if(g.left == g.right[0]){
                    //左再帰を一度でも使っているか？
                    if(left_rec_flag){
                        nukeru = true;
                        console.log("step2",g);
                        console.log("step2","fire");
                        break;　//一度でも使っていたら抜ける
                    }
                    console.log("step2","flag");
                    left_rec_flag = true;　//使っていなければフラグを立てる
                }
            }
        }
        if(nukeru){
            break;
        }

    }
    local_chart.print_chart();

    // step3 term replacement
    console.log("===step3===");
    var state_set_global = global_chart.get_chart();
    for(let i=0;i<state_set_global.length;i++){
        state_set_local = local_chart.get_chart();
        for(let j = 0;j<state_set_local.length;j++){
            console.log(state_set_global[i].lvt() + " vs " + state_set_local[j].category);
            if(state_set_global[i].lvt() == state_set_local[j].category){
                console.log("match");
                console.log(state_set_local[j]);
                console.log(state_set_local[j].print_state());
                //var copied_state = JSON.parse(JSON.stringify(state_set_global[i]));
                //ディープコピー
                var copied_state = _.cloneDeep(state_set_global[i]);
                //console.log("kore?");
                //console.log(copied_state);
                copied_state.replace(state_set_local[j]);
                //console.log(copied_state.print_state());
                temp.push(copied_state);
            }
        }
    }
    global_chart = temp;
    global_chart.print_chart();

    return global_chart; 
}

// var g_chart = new Chart();
// var init_state = new State("S",[],decided=false);
// g_chart.push(init_state);
// const words = ["Dmin7","G7","Emin7","A7","Amin7","D7","Abmin7","Db7","Cmaj7"]

// for(var i = 0;i<words.length;i++){
//     g_chart = chart_parsing(g_chart,words[i]);    
// }

// console.log(g_chart);
