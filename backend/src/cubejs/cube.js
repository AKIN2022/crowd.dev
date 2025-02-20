// Cube.js configuration options: https://cube.dev/docs/config

// NOTE: third-party dependencies and the use of require(...) are disabled for
// CubeCloud users by default.  Please contact support if you need them
// enabled for your account.  You are still allowed to require
// @cubejs-backend/*-driver packages.

module.exports = {
  queryRewrite: (query, { securityContext }) => {
    // Ensure `securityContext` has an `id` property
    if (!securityContext.tenantId) {
      throw new Error('No id found in Security Context!')
    }
    const measureCube = query.measures[0].split('.')

    if (
      query.timeDimensions &&
      query.timeDimensions[0] &&
      !('granularity' in query.timeDimensions[0]) &&
      (!('dateRange' in query.timeDimensions[0]) ||
        ('dateRange' in query.timeDimensions[0] && query.timeDimensions[0].dateRange === undefined))
    ) {
      query.timeDimensions = []
    }

    // If member score is selected as a dimension, filter -1's out
    if (query.dimensions && query.dimensions[0] && query.dimensions[0] === 'Members.score') {
      query.filters.push({
        member: 'Members.score',
        operator: 'notEquals',
        values: ['-1'],
      })
    }

    query.filters.push({
      member: `${measureCube[0]}.tenantId`,
      operator: 'equals',
      values: [securityContext.tenantId],
    })

    return query
  },
}
