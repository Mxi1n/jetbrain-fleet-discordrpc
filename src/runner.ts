import couleurmdr from "colors";
import { exec } from "child_process";

var Parser = require("simple-parser");

export function Windows() {}

export async function Linux() {
  return new Promise((resolve, reject) => {
    exec("wmctrl -l -G", async function (err, data) {
      if (err) {
        return reject(err);
      }

      var hash = [];
      let wnds = data
        .split("\n")
        .filter(Boolean)
        .map(function (line) {
          var parser = new Parser(line);
          var wnd = {
            id: parser.hex(),
            desktop_number: parser.num(),
            x: parser.num(),
            y: parser.num(),
            width: parser.num(),
            height: parser.num(),
            machine_name: parser.string(),
            title: parser.rest(),
          };
          hash[wnd.id] = wnd;
          return wnd;
        });

      const promises = wnds.map((conten2t) => {
        return new Promise((resolve, reject) => {
          exec(
            "xprop -id " + conten2t.id + " | grep WM_CLASS",
            function (err, data) {
              if (err) {
                return reject(err);
              }

              const match = data.match(/WM_CLASS\(STRING\) = "(.*?)",/);
              if (match && match.length >= 2) {
                if (match[1] === "jetbrains-fleet") {
                  resolve(conten2t);
                } else {
                  resolve(null);
                }
              } else {
                resolve(null);
              }
            },
          );
        });
      });

      try {
        const resolvedContents = await Promise.all(promises);
        const content =
          resolvedContents.find((item) => item !== null) || "test";
        resolve(content);
      } catch (err) {
        reject(err);
      }
    });
  });
}

export function macOS() {
  let content = {
    title: "settings.cpp - ihrz",
  };
}
