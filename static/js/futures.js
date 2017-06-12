(function () {

    var pageCommon = wquant.page.common;
    var strategy = wquant.page.strategy;
    var pageSetting = pageCommon.pageSetting;
    var encodeParam = wquant.common.encodeParam;
    var startMove = wquant.dom.startMove;
    var getPath = pageCommon.getPath;
    var getText = wquant.common.getText;
    var MyDialog = wquant.page.plugin.MyDialog;
    var userStatusPath = wquant.config.url.userStatusPath;
    var showLoginDialog = wquant.page.master.showLoginDialog;
    var showConfirmMessage = wquant.page.common.showConfirmMessage;
    var showFlashMessage = wquant.page.common.showFlashMessage;
    var linkPage = wquant.page.common.linkPage;
    var startDraw = wquant.page.strategy.startDraw;

    $(function () {

        pageInit();
        bindEvent();
    });

    var strategyPage = null;
    function pageInit() {

        //客户须知弹框
        var noTip = wquant.cookie.getCookie("noTip");

        if (noTip != "true") {
            var path = getPath(wquant.config.url.modules.customInformation);
            wquant.request.loadHtml(path, function (response, status, xhr) {
                showCustomInfoDialog();

                function showCustomInfoDialog() {
                    costomInfoDialog = new MyDialog({
                        width: "1082",
                        height: "650",
                        modal: true,
                        title: "",
                        content: response
                    });

                    var container = $("#" + costomInfoDialog.id);
                    var btnContinue = $(container).find(".btnContinue");
                    var checkNoTip = $(container).find("#checkNoTip");

                    //确认继续浏览
                    $(btnContinue).click(function () {

                        if ($(checkNoTip).is(":checked")) {
                            wquant.cookie.setCookie("noTip", "true", "d30", "wquant.com");
                        } else {
                            wquant.cookie.delCookie("true");
                        }

                        costomInfoDialog.close();
                    });

                    costomInfoDialog.setTitle("", "#fff");
                    costomInfoDialog.setColseImg();
                    costomInfoDialog.setBorder("4px", "#238acc");

                    costomInfoDialog.show();
                }
            });
        }
    }

    function bindEvent() {

        bindBannerEvent();
        bindFilterEvent();
        bindSortEvent();
        pageStrategy();
        otherEvent();

        function bindBannerEvent() {
            var $container = $(".ul_bannerContent");
            var $items = $container.children();
            var width = 1200;

            $container.prepend($items.last().clone());
            $container.append($items.first().clone());

            $items = $container.children();
            var len = $items.length;
            $items.css("width", width);
            $container.css({ "width": len * width, "margin-left": -width });

            var obj = $container.get(0);
            var isMoving = false;  //左右点击的时候防止重复 
            var timer;
            var now = 1;

            startTimer();

            //主图片悬浮 
            $($container).hover(function () {
                clearInterval(timer);
            }, function () {
                startTimer();
            });

            //数字悬浮 
            $(".dot_switch").hover(function () {
                now = $(this).index() + 1;
                tab();
            }, function () {
                startTimer();
            });

            // 重新开始定时器 
            function startTimer() {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    intervalMove(function () {
                        startTimer();
                    });
                }, 10000);
            }

            //定时器的间隔运动 
            function intervalMove(fn) {
                if (isMoving) {
                    return;
                }
                now++;
                tab(fn);
            }

            //切换函数 
            function tab(fn) {

                clearTimeout(timer);
                isMoving = true;
                var distance = -now * width;
                var dotIndex = now - 1;
                if (now == 0) {
                    dotIndex = len - 3;
                } else if (now == len - 1) {
                    dotIndex = 0;
                }
                $(".dot_switch").eq(dotIndex).addClass("active").siblings().removeClass("active");

                startMove(obj, { "margin-left": distance }, {
                    time: 700,
                    type: "buffer",
                    end: function () {
                        if (now == 0) {
                            now = len - 2;
                            $container.css({ "margin-left": -width * now });
                        } else if (now == len - 1) {
                            now = 1;
                            $container.css({ "margin-left": -width * now });
                        }
                        isMoving = false;
                        fn && fn();
                    }
                });
            }

            $("#bannerPush").click(function () {

                var path = getPath(userStatusPath),
                link = "./UserCenter/Default.aspx?index=01";
                wquant.page.common.linkPage(path, link);
            });
        }

        function bindFilterEvent() {

            //第二层分类
            /*$(".classifyContainer dd span").click(function () {
                $(this).addClass("active");
                $(this).parent().siblings().find("span").removeClass("active");
                freshStrategyList(1, 0);
            });*/
            $(".classifyContainer .dl_mainType dd span").click(function () {
                $(this).addClass("active");
                $(this).parent().siblings().find("span").removeClass("active");
                freshStrategyList(1, 0);
            });
            $(".classifyContainer .dl_investType dd span").click(function () {
                $(this).addClass("active");
                $(this).parent().siblings().find("span").removeClass("active");
                freshStrategyList(1, 0);
            });
            $(".classifyContainer .dl_holdType dd span").click(function () {
                $(this).addClass("active");
                $(this).parent().siblings().find("span").removeClass("active");
                freshStrategyList(1, 0);
            });
            $(".classifyContainer .dl_targetType dd span").click(function () {
                $(this).addClass("active");
                $(this).parent().siblings().find("span").removeClass("active");
                freshStrategyList(1, 0);
            });
            $(".classifyContainer .dl_maxDrawdownRate dd span").click(function () {
                $(this).addClass("active");
                $(this).parent().siblings().find("span").removeClass("active");
                freshStrategyList(1, 0);
            });
            $(".classifyContainer .gmlree dd span").click(function () {
                $(this).addClass("active");
                $(this).parent().siblings().find("span").removeClass("active");
                freshStrategyList(1, 0);
            });
            $(".classifyContainer .gmlshow0").click(function () {
                $(this).addClass("active");
                $('.classifyContainer .dl_targetType dd span').removeClass("active");
                freshStrategyList(1, 0);
            });
            
            //搜索框
            $(".classifyContainer input[type='text']").keydown(function (ev) {
                var oEvent = ev || event;
                if (oEvent.keyCode == 13) {
                    freshStrategyList(1, "0");
                }
            });

            //搜索按钮
            $(".classifyContainer input[type='button']").click(function () {
                freshStrategyList(1, 0);
            });

            var param = pageCommon.urlParamFormat();
            if (typeof (param["type"]) != "undefined") {
                var type = param.type;
                var mainItem = type[0];
                var subItem = type[1];
                var letter = {
                    "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "a": 10, "b": 11, "c": 12, "d": 13, "e": 14, "f": 15, "g": 16, "h": 17, "i": 18, "j": 19, "k": 20, "l": 21, "m": 22, "n": 23, "o": 24, "p": 25, "q": 26, "r": 27, "s": 28, "t": 29
                };
                $(".classifyContainer dl").eq(mainItem).find("dd:eq(" + letter[subItem] + ") span").click();
            }
        }

        //排序
        function bindSortEvent() {
            var sortClass = ["sort_desc", "sort_asc", "noVisible"];
            $(".ulRankTitle li").click(function () {
                var asc = $(this).attr("asc");
                if (!asc) {
                    return;
                }
                var oppoIndex = Math.abs(asc - 1);
                var current = asc;
                if ($(this).attr("order") == "1") {
                    $(this).attr("asc", oppoIndex);
                    current = oppoIndex;
                }
                $(this).addClass("active").attr("order", 1).siblings().removeClass("active").attr("order", "0");
                $(this).siblings().find(".sortArrow").addClass(sortClass[2]);
                $(this).find(".sortArrow").removeClass().addClass("sortArrow").addClass(sortClass[current]);
                freshStrategyList(1, "1");
            });
        }

        //策略分页
        function pageStrategy() {

            var pageSize = 9;
            var tempJqXhr = null;

            strategyInit();

            //策略列表分页初始化
            function strategyInit() {
                strategyPage = new wquant.plugin.MyPage(pageSize, turnStrategyPage);
                strategyPage.setContainer($("#strategy_page"));
            }

            //获取策略列表的主方法
            function turnStrategyPage(pageNo) {
                clearStrategyList();
                var json = createCondition();
                json.pageNo = pageNo;
                json.pageSize = pageSize;

                if (window.top.location.href.indexOf("btv") != -1) {
                    json.btv = 5;
                }
                if (tempJqXhr) {
                    tempJqXhr.abort();
                }
                tempJqXhr = $.ajax({
                    url: "../Handler/Strategy/GetStrategyList30.ashx",
                    type: "POST",
                    dataType: "json",
                    data: json,
                    beforeSend: function () {
                        getCurrentList().html('<img src="../Images/Strategy/loading.gif" style=" margin-left:450px" alt="loading" class="imgLoading"/>');
                    }
                });
                tempJqXhr.done(function (response, status, xhr) {

                    if (response.state == 0) {
                        if (response.total == 0) {
                            getCurrentList().html("<span style='  margin-left: 403px;' class='no_message'>暂时没有相关的策略</span>");
                        }
                        if (response.total > 0) {
                            fillStrategyList(response.data, json);
                        }
                        console.log(pageNo);
                        console.log("---------------");
                        console.log(response.total);
                        strategyPage.setPage(response.total, pageNo);
                    } else {
                        window.parent.showFlashMessage(response.info);
                    }
                }).fail(function (status) {

                });

                //创建条件
                function createCondition() {

                    var index = "1",   //主要类别分类
                        item = "0",   //内容区域                    
                        json = getServerParam(),
                        rank = $(".rankContainer").find(".ulRankTitle").eq(0);         //排序
                    json.type = index;
                    json.name = $(".classifyContainer input[type='text']").eq(0).val();                 //搜索框                    
                    json.investType = $(".classifyContainer").find(".dl_investType .active").attr("investtype");    //投资类型
                    json.tradeType = $(".classifyContainer").find(".dl_mainType .active").attr("tradetype");         //类别
                    json.minMoney = $(".classifyContainer").find(".dl_minMoney .active").attr("minMoney");         //起投金额
                    json.target = $(".classifyContainer").find(".dl_targetType .active").attr("tar");              //品种
                    /* 最大回撤率 */
                    json.maxDrawdownRate = $(".classifyContainer").find(".dl_maxDrawdownRate .active").attr("tar");

                    json.hold = $(".classifyContainer").find(".dl_holdType .active").attr("holdType");             //持仓类型
                    json.order = $(rank).find(".active").attr("index");                            //排序
                    json.asc = $(rank).find(".active").attr("asc");

                    json.investTypeStock = $(".classifyContainer").find(".dl_investTypeStock .active").attr("type");
                    json.class2 = $(".classifyContainer").find(".dl_quantifyType .active").attr("type");
                    return json;
                }

                //获取当前策略列表
                function getCurrentList() {

                    return $(".strategyContainer")
                }

                //策略列表的格式化显示
                function fillStrategyList(list, json) {
                    var content = [];
                    getCommonTemplate(function (template) {

                        var template_rough = $($(template)).html();
                        var container = getCurrentList();

                        $(list).each(function (i, item) {
                            var con = template_rough.format(item.sid, item.imgPath, item.name, item.author, getNumberColor(item.profitMonthly, "%"), item.lastSignalTime, getNumber(item.maxRetrace, "%"),
                             item.price, item.dataPath, item.authorId, item.contract, item.sLabelImg, item.strategystatus);
                            con = con.replace(/_src/g, "src");
                            if (!item.sLabelImg) {
                                con = con.replace("imgLabel", "imgLabel hide");
                            }
                            content.push(con);
                        });

                        getCurrentList().html("").append(content.join(""));

                        fillAfter("1");
                    });


                    function getNumber(data, suffix) {
                        if (data == null || isNaN(data)) {
                            return "--";
                        }
                        if (suffix == null) {
                            suffix = "";
                        }
                        return data + suffix;
                    }

                    function getNumberColor(data, suffix) {
                        if (data == null || isNaN(data)) {
                            return "--";
                        }
                        if (suffix == null) {
                            suffix = "";
                        }
                        var color = "red"
                        if (data < 0) {
                            color = "green";
                        }
                        return "<span style='color:" + color + "'>" + data + suffix + "</span>";
                    }

                    //获取模板
                    function getCommonTemplate(fn) {
                        var path = getPath(wquant.config.url.modules.strategyCommonTemHtml2);
                        wquant.request.loadHtml(path, function (response, status, xhr) {
                            fn && fn(response);
                            getCommonTemplate = function (fn) {
                                fn && fn(response);
                            };
                        });
                    }

                    function fillAfter(index) {
                        //策略列表的格式化显示后的回调
                        var index = "1";
                        var roughContainer = $(".strategyContainer");
                        var straName = "";
                        var swriName = "";

                        //昨日收益率改为最大回撤率
                        $(".yesterdayProfit").html("最大回撤率");

                        $(".straName").each(function (i, item) {
                            var sreategyName = $.trim($(item).text());
                            var len = sreategyName.length;
                            if (len > 10) {
                                straName = sreategyName.substring(0, 10) + "...";
                                $(item).text(straName);
                            }
                        });

                        $(".straWriter").each(function (i, item) {
                            var sreategyName = $.trim($(item).text());
                            var len = sreategyName.length;
                            if (len > 6) {
                                straName = sreategyName.substring(0, 6) + "...";
                                $(item).text(straName);
                            }
                        });

                        //量客
                        $(".strategyContainer .straWriter").click(function () {
                            var wid = $(this).attr("wid");
                            wid && window.open("./../InvestAdviser/Adviser.aspx?wid=" + wid, "_blank");
                            return false;
                        });

                        $(".btnBuy").click(function () {
                            var path = getPath(userStatusPath),
                                sid = $(this).attr("sid"),
                                straStatus = $(this).attr("status");

                            if (straStatus == 2) {
                                showConfirmMessage("该策略暂时缺货");
                                return;
                            }
                            var jqXHR = $.ajax({
                                type: "POST",
                                url: path,
                                data: { type: 1 },
                                dataType: "xml"
                            });
                            //var newWin = window.open('http://www.wquant.com');
                            jqXHR.done(function (response, status, xhr) {
                                var flag = $(response).find("flag").text();
                                var msg = $(response).find("message").text();
                                var type = $(response).find("flag").attr("type");

                                if (type == 1) {
                                    msg && showLoginDialog();
                                } else {
                                    msg && showFlashMessage(msg);
                                }

                                if (flag == "true") {
                                    var jqXHR = $.ajax({
                                        url: "./../Handler/Strategy/AddWithUser.ashx",
                                        type: "POST",
                                        dataType: "xml",
                                        data: { type: 0, sid: sid }
                                    });
                                    jqXHR.done(function (response, satuts, xhr) {

                                        if (!response) {
                                            console.warn && console.warn("没有返回信息");
                                            return;
                                        }
                                        var msg = $.trim($(response).find("message").html());
                                        if ((msg == "添加成功" || "购物车中已经有此策略，请勿重复添加" == msg)) {
                                            //window.open("../UserCenter/Default.aspx?index=22");
                                            var url = "../UserCenter/Default.aspx?index=22";
                                            //newWin.location.href = url;
                                            window.location.href = url;
                                        } else {
                                            showFlashMessage(msg);
                                        }
                                    }).fail(function (error) {
                                    });
                                    
                                }
                            }).fail(function (response, status, xhr) {

                            });
                        });

                        //试用
                        var simulateDialog = null;
                        $(".btnTry").click(function () {

                            var path = getPath(userStatusPath),
                                link = "",
                                sid = $(this).attr("sid");

                            pageCommon.linkPage(path, link, function () {
                                if (!simulateDialog) {
                                    simulateDialog = new wquant.page.plugin.MyDialog({
                                        width: "480",
                                        height: "160",
                                        buttons: [{ visible: false }, { visible: false }],
                                        modal: true,
                                        content: $("#simulateDialog").html()
                                    });
                                    bindSimulateEvent(sid);
                                }
                                simulateDialog.show();
                            });
                        });

                        function bindSimulateEvent(sid) {

                            //取消 我知道了
                            $(".btnCancelSimulate, .btnKonw").click(function () {
                                simulateDialog.close();
                            });

                            //确定
                            $(".btnCertainSimulate").click(function () {

                                simulateDia = $("#" + simulateDialog.id);
                                var jqXHR = $.ajax({
                                    url: "./../Handler/Strategy/UserStrategy_S.ashx",
                                    type: "POST",
                                    dataType: "json",
                                    data: { sid: sid }
                                });
                                jqXHR.done(function (response, satuts, xhr) {

                                    if (!response) {
                                        console.warn && console.warn("没有返回信息");
                                        return;
                                    }
                                    if (response.state == 0) {
                                        $(simulateDia).find(".partTwo p").html(response.info);
                                        $(simulateDia).find(".partTwo").show().siblings().hide();
                                    } else {
                                        $(simulateDia).find(".partThree p").html(response.info);
                                        $(simulateDia).find(".partThree").show().siblings().hide();
                                    }
                                }).fail(function (error) {

                                });
                            });

                            //开始模拟交易
                            $(".btnBeginSimulate").click(function () {
                                var path = getPath(userStatusPath);
                                var link = "./../UserCenter/Default.aspx?index=11";
                                pageCommon.linkPage(path, link, function () {

                                });
                            });
                        }

                        startDraw(roughContainer, "", json.type);  //画走势图                                            
                    }

                }

            }
        }

        //刷新当前策略列表 / 跳转
        function freshStrategyList(num, type) {
            clearStrategyList(type);
            num = isNaN(parseInt(num)) ? 1 : num;
            strategyPage && strategyPage.fresh(strategyPage, 1);
        }

        //清空所有的策略列表和多余的script
        function clearStrategyList(type) {
            if (!type) {                  //type == 1 或type不存在
                $(".roughStraListContainer:visible").html("");
            } else if (type == 1) {
                $(".detailStraListContainer:visible").html("");
            }

            $("script").each(function (i, item) {
                var src = $(item).attr("src");
                var content = $(item).text();
                if ((src && src.match(/data\.js$/)) || (!src && content.match(/^\s*$/))) {
                    $(item).remove();
                }
            });
        }

        function otherEvent() {

            //新品推荐
            $(".recommendItem").click(function () {
                var sid = $(this).attr("sid");
                window.open("Details.aspx?id=" + sid, "_blank");
            });

            //模拟炒股
            $(".simulateTrade").click(function () {

                var path = getPath(userStatusPath),
                link = "./UserCenter/Default.aspx?index=11";
                wquant.page.common.linkPage(path, link);
            });

            $(".recommendItem .strategyName").each(function (i, item) {
                var sreategyName = $.trim($(item).text());
                var len = sreategyName.length;
                if (len > 10) {
                    straName = sreategyName.substring(0, 10) + "...";
                    $(item).text(straName);
                }
            });

            $(".recommendItem .strategyWriter").each(function (i, item) {
                var sreategyName = $.trim($(item).text());
                var len = sreategyName.length;
                if (len > 6) {
                    straName = sreategyName.substring(0, 6) + "...";
                    $(item).text(straName);
                }
            });
        }
    }
})();
