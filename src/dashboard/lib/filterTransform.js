import moment from 'moment';

export const filterTransform = (type, resource, params, query) => {
  if (type === 'GET_LIST' && resource === 'playlist') {
    if (params.filter.hasOwnProperty('startTime')) {
      delete query.where.startTime;
      const startOfDay = moment(params.filter.startTime)
        .startOf('day')
        .toDate();
      const endOffDay = moment(params.filter.startTime).endOf('day').toDate();

      query.where = {
        and: [
          {
            startTime: {
              gte: startOfDay
            }
          },
          {
            endTime: {
              lte: endOffDay
            }
          }
        ]
      };
    }
  }

  return query;
};
