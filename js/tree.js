var width = document.querySelector("svg").clientWidth;
var height = document.querySelector("svg").clientHeight;
var data = {};
var vocabulary = ["Dmin7","G7","Emin7","A7","Amin7","D7","Abmin7","Db7","Cmaj7"]

// 3. 描画用のデータ変換
// temp_root = d3.hierarchy(data);
// temp_root.x0 = width / 2;
// temp_root.y0 = 0;

var current_trees = d3.tree()
  .size([width, height-100])
  .nodeSize([100,100]);
//.separation(function(a, b) { return(a.parent == b.parent ? 1 : 2); });

// svg要素の配置
g = d3.select("svg").append("g").attr("transform", "translate("+ width/2 + ",30)"); //y方向に30だけ下げる

// クリック時の呼び出し関数
function toggle(d) {
  if(d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}

var leaf_depth;
var leaf_size;
var temp_root;
var init_flag;
// svg要素の初期化
function svg_init(source) {
  //svgのg要素を一回まっさらに
  g.remove();
  g = d3.select("svg").append("g").attr("transform", "translate("+ width/2 + ",30)");
  temp_root = source;
  leaf_depth = temp_root.height;
  leaf_size = 0;
  init_flag = true;
  temp_root.eachAfter(function(d){
    if(!d.children && !d._children){
      leaf_size += 1;
    }
  });
  update(source)
}


// クリック時の呼び出し関数
function toggle(d) {
  if(d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}


// svg要素の更新関数
function update(source) {
  current_trees(temp_root);
  console.log("leaf_size " + leaf_size);
    // 子、孫方向の位置設定
  var increment = 150;
  var most_left_x = -1 *  (leaf_size-1) * increment/2 
  console.log("most_left_x",leaf_size);
  var i=0;
  temp_root.eachAfter(function(d) { 
    console.log("node",d.data);
    console.log("node",d.children); //子（見えてる）
    console.log("node",d._children); //子(見えてない(格納されている))
      if(d.children||d._children){ 
        //節 or 未決定節(子がいる)
        d.y = d.depth * 60; 
        var temp_child;
        if(d.children == null){
          temp_child = d._children;
        }else{
          temp_child = d.children;
        } 
        //子が何個ある?
        console.log("node",temp_child.length);
        if(temp_child.length == 1){
          console.log("node","extends node");
          d.x = temp_child[0].x;
          console.log("node",d.x);
        }else{
          console.log("node","mean node");
          var sum = 0;
          for(var child of temp_child){
            console.log("node","child: " + child);
            sum = sum + child.x;
          }
          d.x = sum / temp_child.length;
          console.log("node",d.x);
        }
      }else{
       //(子がいない)
        d.x = most_left_x + increment * i;
        i = i+1 ;
         console.log("leaf data",d.data.name);
        if(vocabulary.indexOf(d.data.name) >= 0){
          //葉が決定項の時 == カテゴリではない
          console.log("leaf",d.data.name);
          d.y = leaf_depth * 60; 
        }else{
            //未決定こうなら下げる
          d.y = d.depth * 60;
        }
        
        console.log("node",d.x);
      }
    });
  // ノードデータをsvg要素に設定
  console.log("enter",temp_root.descendants());

    
  var node = g.selectAll('.node')
        .data(temp_root.descendants(), function(d) { return d.id || (d.id = ++i); });

    console.log("enter",node.enter());
  // ノード enter領域の設定
  var nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d) { console.log("enter", d.data);return "translate(" + source.x0 + "," + source.y0 + ")"; })
      .on("click", function(d) {
        toggle(d);
        update(d); //クリックしたときに自らを根として再帰的に呼び出し
      });

    nodeEnter.append("rect")
      .attr("x", -30)
      .attr("y", -15)
      .attr("width",60)
      .attr("height",30);
      // .attr("stroke-width",1)
      // .attr("stroke","black")
      // .attr("fill", function(d) { return d._children ? "lightsteelblue" : "white"; });

    nodeEnter.append("text")
    .attr("dy", "3")
    .attr("font-size", "150%")
    .attr("fill",function(d){
      return ( d.children || d._children ) ? "black" : "red";})
    .attr("text-anchor", function(d) { return d.children || d._children ? "middle" : "middle"; })
    .text(function(d) { 
      if(!(d.children || d._children) && vocabulary.indexOf(d.data.name) < 0){
        //子が居ないかつ終端記号ではない
        return　"↓" + d.data.name;
      }else{
        return d.data.name; 
      }
    })
    .style("fill-opacity", 1e-6);

    // ノード enter+update領域の設定
    var nodeUpdate = nodeEnter.merge(node);
    var duration = 500;

    if(init_flag){
      nodeUpdate
        .attr("transform", function(d) { 
          console.log(d); 
          console.log("(" + d.x +","+ d.y + ")に移動"); 
          return "translate(" + d.x + "," + d.y + ")"; });    
    }else{
      nodeUpdate
        .transition()
        .duration(duration)
        .attr("transform", function(d) { 
          console.log(d); 
          console.log("(" + d.x +","+ d.y + ")に移動"); 
          return "translate(" + d.x + "," + d.y + ")"; });
    }
    nodeUpdate.select("rect")
    .attr("x",-30)
    .attr("y",-15)
    .attr("width",60)
    .attr("height",30);
    // .attr("stroke-width",1)
    // .attr("stroke",function(d) { return d._children ? "lightsteelblue" : "white"; })
    // .attr("fill", function(d) { return d._children ? "lightsteelblue" : "white"; });

    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // ノード exit領域の設定
    var nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr("transform", function(d) {return "translate(" + source.x + "," + source.y + ")"; })
      .remove();

    nodeExit.select("rect")
    .attr("x", -30)
    .attr("y", -15)
    .attr("width",60)
    .attr("height",30);
    // .attr("stroke-width",1)
    // .attr("stroke","black")
    // .attr("fill", function(d) { return d._children ? "lightsteelblue" : "white"; });

    nodeExit.select("text")
      .style("fill-opacity", 1e-6);

    // リンクデータをsvg要素に設定
    var link = g.selectAll(".link")
      .data(temp_root.links(), function(d) { return d.target.id; });

    // リンク enter領域のsvg要素定義
    var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr("d", function(d) {
      console.log("link:enter");
      //console.log(d);
      console.log("(" + source.x0 +","+ source.y0 + ")->" + "(" + source.x0 +","+ source.y0 + ")");
      return "M" + source.x0 + "," + source.y0 +        
        "L" + (source.x0 ) + "," + (source.y0);
    });
    // リンク enter+update領域の設定
    var linkUpdate = linkEnter.merge(link);

    if(init_flag){
      linkUpdate
        .attr("d", function(d) {
        console.log("link:enter+update");
        console.log("(" + d.source.x +","+ d.source.y + ")->" + "(" + d.target.x +","+ d.target.y + ")") 
        //console.log(d.id);
        return "M" + d.source.x + "," + d.source.y +        
            "L" + (d.target.x ) + "," + (d.target.y);
        });
        init_flag = false;
    }else{
      linkUpdate
        .transition()
        .duration(duration)
        .attr("d", function(d) {
        console.log("link:enter+update");
        console.log("(" + d.source.x +","+ d.source.y + ")->" + "(" + d.target.x +","+ d.target.y + ")") 
        //console.log(d.id);
        return "M" + d.source.x + "," + d.source.y +        
            "L" + (d.target.x ) + "," + (d.target.y);
        });
    }

    // リンク exit領域の設定
    link
      .exit()
      .transition()
      .duration(duration)
      .attr("d", function(d) {
    console.log("link:exit");
    console.log("(" + source.x +","+ source.y + ")->"+"(" + source.x +","+ source.y + ")");
    return "M" + source.x + "," + source.y +        
        "L" + (source.x ) + "," + (source.y);
    })
      .remove();

    // 次の動作のために現在位置を記憶
    node.each(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
}

//   var link = g.selectAll(".link")
//     .data(temp_root.descendants().slice(1))
//     .enter()
//     .append("path")
//     .attr("class", "link")
  // .attr("d", function(d) {
  //   return "M" + d.x + "," + d.y +        
  //     "L" + (d.parent.x ) + "," + (d.parent.y + 40);
  // });
//  // M: moveTo
//  // L: lineTo 

//   var node = g.selectAll(".node")
//     .data(temp_root.descendants())
//     .enter()
//     .append("g")
//     .attr("class", "node")
//     .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

//   node.append("rect")
// 	.attr("x", -40)
// 	.attr("y", 0)
// 	.attr("width", 80)
// 	.attr("height", 35)
// 	.attr("stroke-width",1)
// 	.attr("stroke", "black")
// 	.attr("fill", "none");

//   node.append("text")
// 	.attr("x",-30)
// 	.attr("y",20)
// 	.style("dominant-baseline","central")
// 	//.style("text-anchor", function(d) { return d.children ? "end" : "start"; })
// 	.attr("fill",function(d){
// 		console.log(d.children);
// 		if(d.children == null){
// 			return "red"
// 		}else{ 
// 			return "black"
// 		}
// 	})
//     .attr("font-size", "150%")
//     .text(function(d) { return d.data.name; });