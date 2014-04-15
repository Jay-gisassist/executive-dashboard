﻿/*global */
/*jslint browser:true,sloppy:true,nomen:true,unparam:true,plusplus:true */
/*
 | Copyright 2012 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
var rss = []; //array for storing the rss feeds
var trends = []; //array for storing the twitter trends

//Create settings page according to feeds and trends for personalized RSS feeds and Twitter Trends stored in local storage
function DisplaySettings() {
    dojo.dom.byId("btnSettings").className = "customDisabledButton";
    GetDataFromStorage();
    dojo.dom.byId("imgRSSAdd").onclick = function () {
        if (!dojo.dom.byId("txtRSSFeedName").value.trim()) {
            if (!dojo.dom.byId("txtRSSFeedURL").value.trim()) {
                dojo.dom.byId("RSSErrorMessage").innerHTML = messages.getElementsByTagName("enterRSS")[0].childNodes[0].nodeValue;
                return;
            }
        }
        if (!dojo.dom.byId("txtRSSFeedName").value.trim()) {
            dojo.dom.byId("RSSErrorMessage").innerHTML = messages.getElementsByTagName("RSSName")[0].childNodes[0].nodeValue;
            return;
        }
        if (!dojo.dom.byId("txtRSSFeedURL").value.trim()) {
            dojo.dom.byId("RSSErrorMessage").innerHTML = messages.getElementsByTagName("RSSUrl")[0].childNodes[0].nodeValue;
            return;
        }

        if (!(dojo.dom.byId("txtRSSFeedURL").value.match("http:") || dojo.dom.byId("txtRSSFeedURL").value.match("https:"))) {
            dojo.dom.byId("RSSErrorMessage").innerHTML = messages.getElementsByTagName("UrlFormat")[0].childNodes[0].nodeValue;
            return;
        }
        if (rss) {
            for (var b = 0; b < rss.length; b++) {
                if (dojo.dom.byId("txtRSSFeedName").value.trim() == rss[b].name) {
                    dojo.dom.byId("RSSErrorMessage").innerHTML = messages.getElementsByTagName("existingFeed")[0].childNodes[0].nodeValue;
                    dojo.dom.byId("txtRSSFeedName").value = "";
                    return;
                }
            }
        }
        rss.push({
            "name": dojo.dom.byId("txtRSSFeedName").value.trim(),
            "url": dojo.dom.byId("txtRSSFeedURL").value,
            "checked": false
        });
        PopulateFeedList();
    };
    dojo.dom.byId("imgTwiiterAdd").onclick = function () {
        if (!dojo.dom.byId("txtTwitterTrendName").value.trim()) {
            dojo.dom.byId("twitterErrorMessage").innerHTML = messages.getElementsByTagName("trendName")[0].childNodes[0].nodeValue;
            return;
        }
        if (trends) {
            for (var b = 0; b < trends.length; b++) {
                if (dojo.dom.byId("txtTwitterTrendName").value.trim() == trends[b].name) {
                    dojo.dom.byId("twitterErrorMessage").innerHTML = messages.getElementsByTagName("existingTrend")[0].childNodes[0].nodeValue;
                    dojo.dom.byId("txtTwitterTrendName").value = "";
                    return;
                }
            }
        }
        trends.push({
            "name": dojo.dom.byId("txtTwitterTrendName").value.trim()
        });
        PopulateTrendList();
    };
    PopulateFeedList();
    PopulateTrendList();
}

//Populate RSS feed list in the panel
function PopulateFeedList() {
    dojo.dom.byId("RSSErrorMessage").innerHTML = "";
    RemoveChildren(dojo.dom.byId("divRSSFeedContent"));
    var tblRSSFeedContent = document.createElement("table");
    tblRSSFeedContent.style.width = "100%";
    tblRSSFeedContent.cellSpacing = 0;
    tblRSSFeedContent.cellPadding = 0;
    dojo.dom.byId("divRSSFeedContent").appendChild(tblRSSFeedContent);
    var tBodyRSSFeedContent = document.createElement("tbody");
    tblRSSFeedContent.appendChild(tBodyRSSFeedContent);
    CreateSettingsListTemplate(rss, tBodyRSSFeedContent, true);
    dojo.dom.byId("txtRSSFeedName").value = "";
    dojo.dom.byId("txtRSSFeedURL").value = "";
    CreateScrollbar(dojo.dom.byId('divRSSFeedContainer'), dojo.dom.byId('divRSSFeedContent'));
}

//Populate Twitter Trends list in the panel
function PopulateTrendList() {
    dojo.dom.byId("twitterErrorMessage").innerHTML = "";
    RemoveChildren(dojo.dom.byId("divTwitterFeedContent"));
    var tblTwitterFeedContent = document.createElement("table");
    tblTwitterFeedContent.style.width = "100%";
    tblTwitterFeedContent.cellSpacing = 0;
    tblTwitterFeedContent.cellPadding = 0;
    dojo.dom.byId("divTwitterFeedContent").appendChild(tblTwitterFeedContent);
    var tBodyTwitterFeedContent = document.createElement("tbody");
    tblTwitterFeedContent.appendChild(tBodyTwitterFeedContent);
    CreateSettingsListTemplate(trends, tBodyTwitterFeedContent, false);
    dojo.dom.byId("txtTwitterTrendName").value = "";
    CreateScrollbar(dojo.dom.byId('divTwitterFeedContainer'), dojo.dom.byId('divTwitterFeedContent'));
}

//Move up the position of respective RSS feed or Twitter Trend from list
function MoveUp(Cname, Carray) {
    for (var arr = 0; arr < Carray.length; arr++) {
        if (Cname == Carray[arr].name) {
            var sortArray = [];
            if (arr != 0) {
                sortArray.push({
                    "sort": Carray[arr - 1]
                });
                sortArray.push({
                    "sort": Carray[arr]
                });
                Carray[arr - 1] = sortArray[1].sort;
                Carray[arr] = sortArray[0].sort;
                break;
            } else {
                sortArray.push({
                    "sort": Carray[Carray.length - 1]
                });
                sortArray.push({
                    "sort": Carray[arr]
                });
                Carray[Carray.length - 1] = sortArray[1].sort;
                Carray[arr] = sortArray[0].sort;
                break;
            }
        }
    }
    return Carray;
}

//Move down the position of respective RSS feed or Twitter trend in the list
function MoveDown(Dname, Darray) {
    for (var arr = 0; arr < Darray.length; arr++) {
        if (Dname == Darray[arr].name) {
            var sortArray = [];
            if (arr != (Darray.length - 1)) {
                sortArray.push({
                    "sort": Darray[arr + 1]
                });
                sortArray.push({
                    "sort": Darray[arr]
                });
                Darray[arr + 1] = sortArray[1].sort;
                Darray[arr] = sortArray[0].sort;
                break;
            } else {
                sortArray.push({
                    "sort": Darray[0]
                });
                sortArray.push({
                    "sort": Darray[arr]
                });
                Darray[0] = sortArray[1].sort;
                Darray[arr] = sortArray[0].sort;
                break;
            }
        }
    }
    return Darray;
}

//Remove RSS feed or Twitter trend from list
function RemoveElement(Rname, Rarray) {
    for (var l = 0; l < Rarray.length; l++) {
        if (Rname == Rarray[l].name) {
            Rarray.splice(l, 1);
            break;
        }
    }
    return Rarray;
}

//Create the settings list for Rss feed or Twitter trend
function CreateSettingsListTemplate(arrayList, tBodyTemplate, feed) {
    if (arrayList) {
        for (var r = 0; r < arrayList.length; r++) {
            var trTemplate = document.createElement("tr")
            if (r % 2 != 0) {
                trTemplate.className = "listDarkColor";
            } else {
                trTemplate.className = "listLightColor";
            }
            tBodyTemplate.appendChild(trTemplate);
            var tdTemplate = document.createElement("td");
            tdTemplate.style.width = "75%";
            tdTemplate.style.paddingLeft = "3px";
            tdTemplate.style.paddingTop = "10px";
            tdTemplate.style.paddingBottom = "10px";
            tdTemplate.style.borderBottom = "1px #000 solid";
            if (arrayList[r].name.length > ((isBrowser) ? 100 : 70)) {
                tdTemplate.innerHTML = arrayList[r].name.trimString(((isBrowser) ? 100 : 70));
                tdTemplate.title = arrayList[r].name;
            }
            else {
                tdTemplate.innerHTML = arrayList[r].name;
            }
            trTemplate.appendChild(tdTemplate);

            var tdUp = document.createElement("td");
            tdUp.style.borderBottom = "1px #000 solid";
            tdUp.align = "center";
            tdUp.className = 'imgOptions';
            trTemplate.appendChild(tdUp);
            var imgUP = document.createElement("img");
            imgUP.id = "imgUP" + arrayList[r].name;
            imgUP.setAttribute("ComName", arrayList[r].name);
            imgUP.src = "images/up-arrow.png";
            imgUP.title = "Move up";
            imgUP.style.cursor = "pointer";
            if (arrayList.length > 1) {
                imgUP.style.display = "block";
            } else {
                imgUP.style.display = "none";
            }
            imgUP.className = 'imgOptions';
            imgUP.onclick = function (evt) {
                var array = MoveUp(this.getAttribute("ComName"), arrayList);
                if (feed) {
                    rss = array;
                    PopulateFeedList();
                } else {
                    trends = array;
                    PopulateTrendList();
                }
            }
            tdUp.appendChild(imgUP);
            var tdDown = document.createElement("td");
            tdDown.style.borderBottom = "1px #000 solid";
            tdDown.className = 'imgOptions';
            tdDown.align = "center";
            trTemplate.appendChild(tdDown);
            var imgDown = document.createElement("img");
            imgDown.id = "imgDown" + arrayList[r].name;
            imgDown.src = "images/down-arrow.png";
            imgDown.setAttribute("ComName", arrayList[r].name);
            imgDown.style.cursor = "pointer";
            imgDown.title = "Move down";
            if (arrayList.length > 1) {
                imgDown.style.display = "block";
            } else {
                imgDown.style.display = "none";
            }
            imgDown.className = 'imgOptions';
            imgDown.onclick = function () {
                var dArray = MoveDown(this.getAttribute("ComName"), arrayList)
                if (feed) {
                    rss = dArray;
                    PopulateFeedList();
                } else {
                    trends = dArray;
                    PopulateTrendList();
                }
            }
            tdDown.appendChild(imgDown);
            var tdClose = document.createElement("td");
            tdClose.style.borderBottom = "1px #000 solid";
            tdClose.align = "center";
            tdClose.className = 'imgOptions';
            trTemplate.appendChild(tdClose);
            if (!arrayList[r].type) {
                var imgClose = document.createElement("img");
                imgClose.id = "imgClose" + arrayList[r].name;
                imgClose.setAttribute("ComName", arrayList[r].name);
                imgClose.src = "images/close.png";
                imgClose.style.cursor = "pointer";
                imgClose.className = 'imgOptions';
                imgClose.title = "Remove";
                imgClose.onclick = function (evt) {
                    var Rarray = RemoveElement(this.getAttribute("ComName"), arrayList);
                    if (feed) {
                        rss = Rarray;
                        PopulateFeedList();
                    } else {
                        trends = Rarray;
                        PopulateTrendList();
                    }
                }
                tdClose.appendChild(imgClose);
            }

            if (feed) {
                var tdCheck = document.createElement("td");
                tdCheck.style.borderBottom = "1px #000 solid";
                tdCheck.align = "center";
                tdCheck.className = 'imgOptions';


                var check = document.createElement("img");
                check.className = 'imgOptions';

                if (arrayList[r].checked) {
                    check.src = "images/checked.png";
                    check.setAttribute("checked", true);
                } else {
                    check.src = "images/unchecked.png";
                    check.setAttribute("checked", false);
                }
                check.onclick = function () {
                    if (this.getAttribute("checked").bool()) {
                        this.src = "images/unchecked.png";
                        this.setAttribute("checked", false);
                    }
                    else {
                        this.src = "images/checked.png";
                        this.setAttribute("checked", true);
                    }

                    for (var z = 0; z < arrayList.length; z++) {
                        if (this.id.split("chkBox")[1] == arrayList[z].name) {
                            arrayList[z].checked = this.getAttribute("checked").bool();
                            rss = arrayList;
                        }
                    }
                }
                check.id = 'chkBox' + arrayList[r].name;
                tdCheck.appendChild(check);
                trTemplate.appendChild(tdCheck);
            }
        }
    }
}

//Save changed settings
function SaveSettings() {
    dojo.dom.byId("btnSettings").className = "customButton";
    dojo.dom.byId("btnSettings").style.cursor = "pointer";
    if (rss) {
        for (var l = 0; l < rss.length; l++) {
            if (dojo.dom.byId("chkBox" + rss[l].name).getAttribute("checked").bool()) {
                rss[l].checked = true;
            } else {
                rss[l].checked = false;
            }
        }
    }

    localStorage.setItem("RSSFeedCollection", dojo.toJson(rss));
    localStorage.setItem("TwitterTrendCollection", dojo.toJson(trends));
    PopulateNews(dojo.dom.byId("btnNews"));
    dojo.dom.byId("divSettingsContainer").style.display = "none";
    dojo.dom.byId("divInfoContainer").style.display = "block";
    if (isTablet) {
        SetHomePageHeight();
    }
}

//Cancel changes to settings
function CancelSettings() {
    dojo.dom.byId("btnSettings").className = "customButton";
    dojo.dom.byId("btnSettings").style.cursor = "pointer";
    dojo.dom.byId("divInfoContainer").style.display = "block";
    dojo.dom.byId("divSettingsContainer").style.display = "none";
    GetDataFromStorage();

    if (isTablet) {
        SetHomePageHeight();
    }
}

//Fetch RSS Feeds and Twitter Trends from local storage
function GetDataFromStorage() {
    if (dojo.fromJson(localStorage.getItem("RSSFeedCollection"))) {
        rss = dojo.fromJson(localStorage.getItem("RSSFeedCollection"));
        if (!rss) {
            rss = [];
            rss.push({
                "name": defaultNewsFields[0].RSSFeedName,
                "url": defaultNewsFields[0].RSSFeedURL,
                "checked": true,
                "type": "default"
            });
        }
    }
    if (dojo.fromJson(localStorage.getItem("TwitterTrendCollection"))) {
        trends = dojo.fromJson(localStorage.getItem("TwitterTrendCollection"));
        if (!trends) {
            trends = [];
            trends.push({
                "name": defaultNewsFields[1].TwitterTrendName,
                "type": "default"
            });
        }
    }
}
