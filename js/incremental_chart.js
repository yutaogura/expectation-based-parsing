

const CATEGORY =　["S","I_C","II_C","V_C","II_G","V_G","V_Gb","II_Gb","V_D","II_D"];
const LEXICON = {"Cmaj7":["I_C"],"Dmin7":["II_C"],"G7":["V_C"],"D7":["V_G"],"Emin7":["II_D"],"A7":["V_D"],"Amin7":["II_G"],"Abmin7":["II_Gb"],"Db7":["V_Gb"]};

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
            //console.log(moji);
        }
    }
    get_chart() {
        return this.chart;
    }

}


var Grammar = [
    new Rule("S", ["I_C"]),
    new Rule("I_C", ["V_C", "I_C"]),
    new Rule("I_C", ["I_C", "I_C"]),
    new Rule("V_C", ["II_C", "V_C"]),
    new Rule("V_C", ["V_G", "V_C"]),
    new Rule("V_C", ["V_Gb"]),
    new Rule("V_Gb", ["II_Gb", "V_Gb"]),
    new Rule("V_G", ["II_G", "V_G"]),
    new Rule("V_G", ["V_D", "V_G"]),
    new Rule("V_D", ["II_D", "V_D"])]
console.log("==print_grammar==")
for(let i = 0; i < Grammar.length; i++){
    console.log(Grammar[i].print_rule())
}

function chart_parsing(global_chart,w){
    var local_chart = new Chart();
    var temp = new Chart();

    console.log("====init====");
    console.log("==== " + w + " was inputed =====");


    console.log("==step1==")
    for(var i =0; i< CATEGORY.length;i++){
        if(CATEGORY[i] == LEXICON[w]){
            local_chart.push(new State(CATEGORY[i],[new State(w,[])]));
        }
    }
    local_chart.print_chart();


    console.log("===step2===");
    var left_rec_flag = false;
    var nukeru = false;
    var state_set_local = local_chart.get_chart();
    for(let i = 0;i<state_set_local.length;i++){
        for(let j = 0;j<Grammar.length;j++){
            var g = Grammar[j];
            if(g.right[0] == state_set_local[i].category){
                var subseq = [state_set_local[i]];
                var slice = g.right.slice(1);
                for(let k = 0; k<slice.length;k++){
                    var right = slice[k]; //check
                    subseq.push(new State(right,[],decided = false))
                }
                var new_state = new State(g.left,subseq);
                local_chart.push(new_state);
                //console.log(JSON.parse(JSON.stringify(new_state)));
                if(left_rec_flag){
                    nukeru = true;
                    break;
                }
                if(g.left == g.right[0]){
                    left_rec_flag = true;
                }
            }
        }
        if(nukeru){
            break;
        }

    }
    local_chart.print_chart();

    // step3 Replacing Terms
    console.log("===step3===");
    var state_set_global = global_chart.get_chart();
    for(let i=0;i<state_set_global.length;i++){
        state_set_local = local_chart.get_chart();
        for(let j = 0;j<state_set_local.length;j++){
            //console.log(state_set_global[i].lvt() + " vs " + state_set_local[j].category);
            if(state_set_global[i].lvt() == state_set_local[j].category){
                //console.log("match");
                //console.log(state_set_local[j]);
                //console.log(state_set_local[j].print_state());
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
