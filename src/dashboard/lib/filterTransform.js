import moment from 'moment';
import { GET_LIST } from './aor-loopback/types';

export const filterTransform = {
  [GET_LIST]: {
    playlist: function(params, query) {
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
      return query;
    },
    tracks: function(params, query) {
      if (params.filter.hasOwnProperty('title')) {
        query.where.title = {
          like: `${params.filter.title}`,
          options: 'i'
        };
      }
      return query;
    }
  }
};
