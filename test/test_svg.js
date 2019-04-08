const { pathDataToPolys } = require('../svg-path-to-polygons');
// const { pathDataToPolys } = require('svg-path-to-polygons');

// let o = pathDataToPolys('M902,570.5c9.8,0,14.6-7.3,14.8-14.2c0.3-7.7-4.7-15.8-14.7-16.5H902h-0.1c-10,0.7-15,8.8-14.7,16.5 C887.4,563.1,892.2,570.5,902,570.5z M902,543.8c7.4,0.6,11,6.7,10.8,12.4c-0.2,4/**/.7-3.1,10.3-10.8,10.3s-10.7-5.6-10.9-10.3C890.9,550.6,894.3,544.4,902,543.8z');
// console.log(o);

var rf = require("fs");
var dom = require("xmldom").DOMParser;
var data = rf.readFileSync("/Users/henan.wang/Downloads/mandala2.svg", "utf-8");
var doc = new dom().parseFromString(data);
// console.log(doc);
var pathes = doc.documentElement.getElementsByTagName("path");
// console.log(pathes);
var polygons = [];
Object.keys(pathes).forEach(function(key){
    let path = pathes[key];
    // console.log(path);
    try {
        let d = path.getAttribute("d");
        // console.log(d);
        let o = pathDataToPolys(d);
        // console.log(o.length);
        if (o.length > 0) {
            o = [o[0]];  // TODO only use o[0]
            for (let oi in o) {
                let ois = [];
                for (let oii in o[oi]) {
                    // console.log(oii);
                    if (oii != "closed") {
                        ois.push(o[oi][oii].join(","));
                    }
                }
                let polygon = "<polygon fill=\"none\" stroke=\"#000000\" stroke-width=\"3.5\" stroke-miterlimit=\"10\" points=\"" + ois.join(" ") + "\"/>";
                polygons.push(polygon);
            }
        }
    } catch(e) {
        console.log(path);
        console.log(e);
    }
});
var header = "<svg version=\"1.1\" id=\"Mandala\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n" +
    "\t viewBox=\"302 -180.1 1200 1200\" style=\"enable-background:new 302 -180.1 1200 1200;\" xml:space=\"preserve\">\n" +
    "<style type=\"text/css\">\n" +
    "\t.st0{fill:#80D2FF;}\n" +
    "</style>\n" +
    "<rect x=\"302\" y=\"-180.1\" class=\"st0\" width=\"1200\" height=\"1200\"/>\n" +
    "<g>\n";
var footer = "\n</g>\n</svg>";
var polygons_str = header+polygons.join("\n")+footer;
rf.writeFileSync("/Users/henan.wang/Downloads/mandala2_polygon.svg", polygons_str, "utf-8");
