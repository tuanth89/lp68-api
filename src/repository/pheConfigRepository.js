"use strict";

const PheConfig = require('../models/pheConfig');
const Q = require("q");
const errors = require('restify-errors');
const ObjectId = require('mongoose').Types.ObjectId;
const Serializer = require('../serializers/pheConfig');
const _ = require('lodash');


/**
 *
 * @param id
 * @returns {*|promise}
 */
function findById(id) {
    const deferred = Q.defer();

    PheConfig
        .findOne({
            _id: id
        })
        .exec(function (err, user) {
            if (err) {
                deferred.reject(new errors.InvalidContentError(err.message));
            } else if (!user) {
                deferred.reject(new errors.ResourceNotFoundError('The resource you requested could not be found.'));
            } else {
                deferred.resolve(user);
            }
        });

    return deferred.promise;
}

function findByDayAndLoanMoney(day, loanMoney, isCustomerNew) {
    const deferred = Q.defer();

    PheConfig
        .findOne({
            isNewCustomer: isCustomerNew,
            day: day,
            loanMoneyPack: loanMoney
        })
        .select(Serializer.forStaff)
        .exec(function (err, phe) {
            if (err) {
                deferred.reject(new errors.InvalidContentError(err.message));
            } else {
                if (phe)
                    phe._id = ObjectId(phe._id);

                deferred.resolve(phe);
            }
        });

    return deferred.promise;
}

/**
 * @param params
 * @returns {*|promise}
 */
function getList(params) {
    const deferred = Q.defer();
    let isNewCustomer = params.isNewCustomer === "true";

    let query = [
        {
            $match: {isNewCustomer: isNewCustomer}
        }
        , {
            $sort: {loanMoneyPack: 1, day: 1}
        }
        , {
            $group: {
                _id: "loanMoneyPack",
                docs: {
                    $push: "$$ROOT"
                }
            }
        }
        , {
            $project: {
                money_1000: {
                    $filter: {
                        input: "$docs",
                        as: "item",
                        cond: {$eq: ["$$item.loanMoneyPack", 1000]}
                    }
                },
                money_2000: {
                    $filter: {
                        input: "$docs",
                        as: "item",
                        cond: {$eq: ["$$item.loanMoneyPack", 2000]}
                    }
                },
                money_2500: {
                    $filter: {
                        input: "$docs",
                        as: "item",
                        cond: {$eq: ["$$item.loanMoneyPack", 2500]}
                    }
                },
                money_3000: {
                    $filter: {
                        input: "$docs",
                        as: "item",
                        cond: {$eq: ["$$item.loanMoneyPack", 3000]}
                    }
                },
                money_3500: {
                    $filter: {
                        input: "$docs",
                        as: "item",
                        cond: {$eq: ["$$item.loanMoneyPack", 3500]}
                    }
                },
                money_4000: {
                    $filter: {
                        input: "$docs",
                        as: "item",
                        cond: {$eq: ["$$item.loanMoneyPack", 4000]}
                    }
                },
                money_5000: {
                    $filter: {
                        input: "$docs",
                        as: "item",
                        cond: {$eq: ["$$item.loanMoneyPack", 5000]}
                    }
                },
                money_6000: {
                    $filter: {
                        input: "$docs",
                        as: "item",
                        cond: {$eq: ["$$item.loanMoneyPack", 6000]}
                    }
                },
                money_7500: {
                    $filter: {
                        input: "$docs",
                        as: "item",
                        cond: {$eq: ["$$item.loanMoneyPack", 7500]}
                    }
                },
                money_8000: {
                    $filter: {
                        input: "$docs",
                        as: "item",
                        cond: {$eq: ["$$item.loanMoneyPack", 8000]}
                    }
                },
                money_10000: {
                    $filter: {
                        input: "$docs",
                        as: "item",
                        cond: {$eq: ["$$item.loanMoneyPack", 10000]}
                    }
                },
                money_12500: {
                    $filter: {
                        input: "$docs",
                        as: "item",
                        cond: {$eq: ["$$item.loanMoneyPack", 12500]}
                    }
                },
                money_15000: {
                    $filter: {
                        input: "$docs",
                        as: "item",
                        cond: {$eq: ["$$item.loanMoneyPack", 15000]}
                    }
                },
                money_20000: {
                    $filter: {
                        input: "$docs",
                        as: "item",
                        cond: {$eq: ["$$item.loanMoneyPack", 25000]}
                    }
                },
                money_30000: {
                    $filter: {
                        input: "$docs",
                        as: "item",
                        cond: {$eq: ["$$item.loanMoneyPack", 30000]}
                    }
                },
                money_40000: {
                    $filter: {
                        input: "$docs",
                        as: "item",
                        cond: {$eq: ["$$item.loanMoneyPack", 40000]}
                    }
                }
            }
        }
    ];

    PheConfig
        .aggregate(query)
        .exec(function (error, pheArr) {
            if (error) {
                console.error(error);
                deferred.reject(new errors.InvalidContentError(err.message));
            } else {
                let data = [];
                if (pheArr.length > 0) {
                    let list = pheArr[0];

                    _.forIn(list, function(item, key) {
                        let obj = {};
                        if (item instanceof Array) {
                            // obj = Object.assign({}, item.map((el, i) => ({[el.day]: el.receive})));
                            obj = item.reduce((obj, item) => (obj[item.day] = item.receive, obj), {});
                            obj.loanMoneyPack = item[0].loanMoneyPack;
                            obj.isNewCustomer = item[0].isNewCustomer;

                            data.push(obj);
                        }
                    });

                    // Object.keys(list).forEach(function(key) {
                    //     // console.log(key, obj[key]);
                    //     let item = list[key];
                    //     let obj = {};
                    //     if (item instanceof Array) {
                    //         // obj = Object.assign({}, item.map((el, i) => ({[el.day]: el.receive})));
                    //         obj = item.reduce((obj, item) => (obj[item.day] = item.receive, obj), {});
                    //         obj.loanMoneyPack = item[0].loanMoneyPack;
                    //         obj.isNewCustomer = item[0].isNewCustomer;
                    //
                    //         data.push(obj);
                    //     }
                    // });

                    // for (let item of Object.values(list)) {
                    //     let obj = {};
                    //     if (item instanceof Array) {
                    //         // obj = Object.assign({}, item.map((el, i) => ({[el.day]: el.receive})));
                    //         obj = item.reduce((obj, item) => (obj[item.day] = item.receive, obj), {});
                    //         obj.loanMoneyPack = item[0].loanMoneyPack;
                    //         obj.isNewCustomer = item[0].isNewCustomer;
                    //
                    //         data.push(obj);
                    //     }
                    // }
                }

                deferred.resolve(data);
            }
        });

    return deferred.promise;
}

/**
 *
 * @param data
 * @returns {*|promise}
 */
function save(data) {
    const deferred = Q.defer();

    findById(data._id)
        .then((item) => {
            if (item) {
                deferred.resolve(item);
            }
            else {
                let pheConfig = new PheConfig(data);
                pheConfig.save(function (error, user) {
                    if (error) {
                        console.error(error);

                        deferred.reject(new errors.InvalidContentError("Not found"));
                        return deferred.promise;

                        // deferred.reject(new errors.InternalError(error.message));
                    } else {
                        deferred.resolve(user);
                    }
                });
            }

        })
        .catch((error) => {
            console.error(error);

            deferred.reject(new errors.InvalidContentError("Not found"));
            return deferred.promise;
        });

    return deferred.promise;
}


/**
 *
 * @param id
 * @returns {*|promise}
 */
function remove(id) {
    const deferred = Q.defer();

    PheConfig.remove({
        _id: id
    }, function (error) {
        if (error) {
            console.error(error);
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(true);
        }
    });

    return deferred.promise;
}

/**
 * Cập nhật số lượng lơn dữ liệu.
 * @param {Array} data
 */
function updateBulk(data) {
    const deferred = Q.defer();
    let bulk = PheConfig.collection.initializeUnorderedBulkOp();
    _.each(data, function (item) {
        if (!item._id) {
            item._id = new ObjectId();
            item.createdAt = new Date();
        }
        else {
            item.createdAt = new Date(item.createdAt);
            item._id = ObjectId(item._id);
            item.updatedAt = new Date();
        }

        let pheConfigItem = new PheConfig(item);

        bulk.find({_id: ObjectId(pheConfigItem._id)})
        // .upsert() // Tạo mới document khi mà không có document nào đúng với tiêu chí tìm kiếm.
            .updateOne(pheConfigItem);
    });

    bulk.execute(function (error, results) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(results);
        }
    });

    return deferred.promise;
}


module.exports = {
    findById: findById,
    findByDayAndLoanMoney: findByDayAndLoanMoney,
    getList: getList,
    save: save,
    remove: remove,
    updateBulk: updateBulk
};