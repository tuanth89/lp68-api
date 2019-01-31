const _ = require("lodash");
const errors = require("restify-errors");
const Q = require("q");
const moment = require("moment");
const User = require("../models/user");
const Serializer = require("../serializers/user");
const StringService = require("../services/stringService");
const HashService = require("../services/hashService");
const { to } = require("../services/utilService");

function getList(filter) {
  let d = Q.defer();
  let query = [];

  if (filter.search) {
    filter.search = StringService.getRegexSearchString(filter.search);
    query.push({
      $or: [{
        _name: {
          $regex: filter.search,
          $options: "i"
        }
      },
      {
        username: {
          $regex: filter.search,
          $options: "i"
        }
      },
      {
        email: {
          $regex: filter.search,
          $options: "i"
        }
      },
      {
        _disableReason: {
          $regex: filter.search,
          $options: "i"
        }
      },
      {
        phone: {
          $regex: filter.search,
          $options: "i"
        }
      },
      {
        "creatorUser._name": {
          $regex: filter.search,
          $options: "i"
        }
      }
      ]
    });
  }

  if (filter.role) {
    query.push({
      roles: filter.role
    });
  }

  if (filter.province) {
    query.push({
      "province._id": filter.province
    });
  }

  // //Lọc theo trạng thái: 1: Chưa kích hoạt, 2: Hoạt động, 3: Bị khóa
  // if (filter.status) {
  //   if (filter.status == 1) {
  //     query.push({
  //       activateToken: {
  //         $ne: ""
  //       }
  //     });
  //
  //     query.push({
  //       enabled: false
  //     });
  //   }
  //
  //   if (filter.status == 2) {
  //     query.push({
  //       enabled: true
  //     });
  //   }
  //
  //   if (filter.status == 3) {
  //     query.push({
  //       enabled: false
  //     });
  //
  //     query.push({
  //       activateToken: ""
  //     });
  //   }
  // }

  let startRow = (filter.page - 1) * filter.per_page;

  let aggregate = [{
    $lookup: {
      from: "users",
      localField: "creator",
      foreignField: "_id",
      as: "creatorUser"
    }
  },
  {
    $match: query.length ? {
      $and: query
    } : {}
  },
  {
    $sort: {
      createdAt: -1
    }
  },
  {
    $group: {
      _id: null,
      // get a count of every result that matches until now
      total: {
        $sum: 1
      },
      // keep our results for the next operation
      docs: {
        $push: "$$ROOT"
      }
    }
  },
  // and finally trim the results to within the range given by start/endRow
  {
    $project: {
      total: 1,
      docs: {
        $slice: ["$docs", startRow, filter.per_page]
      }
    }
  }
  ];

  User.aggregate(aggregate).then(result => {
    if (result.length == 0) {
      d.resolve({
        docs: [],
        total: 0
      });
    }

    result = result[0];
    result.page = filter.page;
    result.limit = filter.per_page;
    result.pages = Math.ceil(result.total / filter.per_page);

    result.docs = result.docs.map(item => {

      let status;
      if (item.activateToken != "" && item.enabled == false) status = 1;

      else if (item.enabled) status = 2;

      else if (item.enabled == false && item.activateToken == "") {
        status = 3;
      }

      item.status = status;

      item.creator = _.pick(item.creatorUser[0], ['_id', 'name']);
      item = _.pick(item, Serializer.list.split(" "));

      return item;
    });

    d.resolve(result);
  }).catch(err => {
    d.reject(err);
  });

  return d.promise;
}

function getById(id) {
  let d = Q.defer();

  User.findOne({
    _id: id
  })
    // .populate({
    //   path: "disabledUser",
    //   select: "name"
    // })
    // .populate({
    //   path: "creator",
    //   select: "name"
    // })
    // .select(Serializer.detail)
    .exec((err, result) => {
      if (err) {
        d.reject(new errors.InvalidContentError(err.message));
      }
      if (!result) {
        d.reject(
          new errors.ResourceNotFoundError(
            "The resource you requested could not be found."
          )
        );

      } else {
        d.resolve(
          result.toObject({
            virtuals: true
          })
        );
      }
    });

  return d.promise;
}

function setActivate(id, data) {
  let deferred = Q.defer();

  let updateData = {
    $set: data
  };

  if (data.enabled == false) {
    data.expiredAt = moment();
    data.activateToken = "";
  } else {
    updateData.$unset = {
      expiredAt: "",
      activateToken: "",
      disabledUser: null
    };
    data.disableReason = "";
  }

  User.findOneAndUpdate({ _id: id }, updateData, { new: true },
    (error, result) => {
      if (error) {
        deferred.resolve(error)
      }
      else {
        result.name = decode(result.name);
        deferred.resolve(result);
      }
    }
  );

  return deferred.promise;
}

let create = async data => {
  data = await generateInfo(data);

  let hashed = HashService.saltHashPassword(data.password);

  data.password = hashed.passwordHash;
  data.salt = hashed.salt;

  if (data.enabled) {
    data.activateToken = "";
    data.activateTokenDate = new Date();
  } else {
    data.activateToken = uuid.v4();
    data.activateTokenDate = moment().add(1, "days");
  }

  if (!data.name) {
    data.name = data.email;
  }

  let newUser = new User(data);
  try {
    let [error, user] = await to(newUser.save());

    if (error) {
      console.log(error);
      let errorMessage = error.message;

      if (errorMessage.indexOf("email") >= 0) {
        throw new errors.InvalidContentError("Email đã tồn tại!");
      } else {
        throw new errors.InvalidContentError(errorMessage);
      }
    }
    return user;
  } catch (err) {
    throw new errors.InvalidContentError(err);
  }
};

/**
 * Cấu hình quyền cho tài khoản
 */
let setRoles = function (data) {
  let d = Q.defer();

  User.findOneAndUpdate({
    email: data.email
  }, {
      roles: data.roles
    }, {
      new: true
    },
    (err, result) => {
      if (err) {
        d.reject(err);
      } else {
        d.resolve(result);
      }
    }
  );

  return d.promise;
};

let generateInfo = async data => {
  try {
    // if (data.province) {
    //   let provinceId = data.province;
    //   delete data.province;
    //
    //   try {
    //     data.province = await ProvinceModel.findOne({
    //       _id: provinceId
    //     });
    //   } catch (err) { }
    // }
    //
    // if (data.district) {
    //   let districtId = data.district;
    //   delete data.district;
    //   try {
    //     data.district = await DistrictModel.findOne({
    //       _id: districtId
    //     });
    //   } catch (err) { }
    // }

    if (!data.username) {
      data.username = await generateUsername(data.name);
    }

    return data;
  } catch (err) {
    return data;
  }
};

let generateUsername = async name => {
  name = StringService.convertViToEn(name);
  name = name.replace(/\s/g, "");

  let [error, count] = await to(countByUsername(name));
  if (error) {
    throw new errors.InvalidContentError(error.message);
  }

  if (count > 0) {
    return `${name}${count}`;
  } else {
    return name;
  }
};

let countByUsername = async username => {
  let [error, count] = await to(
    User.countDocuments({
      username: new RegExp("^" + username + "(-[0-9]{0,4})?$", "i")
    })
  );
  if (error) {
    throw new errors.InvalidContentError(error.message);
  }

  return count;
};

module.exports = {
  getList,
  getById,
  setActivate,
  create,
  setRoles
};