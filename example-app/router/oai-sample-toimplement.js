const express = require('express')

const { authUser } = require('../services/auth')
const { healthcheck, getFacilities, getCrowdlevels } = require('../controller/api')

const mongo = require('../services/mongodb')

module.exports = express.Router()
  /**
   * @swagger
   * /api/healthcheck:
   *    get:
   *      tags:
   *        - "Base"
   *      description: Perform a simple health check
   *      responses:
   *        '200':
   *          description: OK
   *          content:
   *            application/json:
   *              schema:
   *                properties:
   *                  status:
   *                    type: string
   *                    example: OK
   *        default:
   *          description: Unexpected error
   */
  .get('/healthcheck', healthcheck) // health check

  /**
   * @swagger
   * definition:
   *    ObjectResponseFacilities:
   *      properties:
   *        status:
   *          type: string
   *          example: "OK"
   *          description: OK or ERROR
   *        count:
   *          type: integer
   *          description: Number of filtered records
   *          example: 1
   *        results:
   *          type: array
   *          description: array of crowd levels
   *          items:
   *            properties:
   *              spaceoutId:
   *                type: string
   *                example: "348"
   *              name:
   *                type: string
   *                example: "JURONG POINT"
   *              type:
   *                type: string
   *                example: "MALL"
   *              postalcode:
   *                type: string
   *                example: "789312"
   *              lng:
   *                type: number
   *                example: 103.52
   *              lat:
   *                type: number
   *                example: 1.12
   *
   */

  /**
   * @swagger
   * /api/facilities:
   *    get:
   *      tags:
   *        - "Base"
   *      security:
   *        - bearerAuth: []
   *      description: get facilities
   *      parameters:
   *        - in: query
   *          name: page
   *          schema:
   *            oneOf:
   *              - type: string
   *              - type: integer
   *          description: current page (starting index is 1)
   *        - in: query
   *          name: limit
   *          schema:
   *            oneOf:
   *              - type: string
   *              - type: integer
   *          description: maximum rows per page (default is 20)
   *        - in: query
   *          name: name
   *          schema:
   *            type: string
   *          description: search name (case insensitive)
   *      responses:
   *        '200':
   *          description: an array of facilities information
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/definitions/ObjectResponseFacilities'
   *        default:
   *          description: Unexpected error
   */
  .get('/facilities', authUser, getFacilities)

  // we should use caching to improve performance
  // •	Date range: to return the average crowd band for each facility between the start date and end date of the given date range. The start date and end date will be compared against the created date of the data points retrieved from the API #2 above.
  // min 1 day, max 14 days
  // •	If filters are empty, return the latest data point for each facility.
  /**
   * @swagger
   *  definition:
   *    ObjectResponseCrowdlevels:
   *      properties:
   *        status:
   *          type: string
   *          description: OK or ERROR
   *          example: "OK"
   *        count:
   *          type: integer
   *          description: Number of filtered records
   *          example: 1
   *        results:
   *          type: array
   *          description: array of crowd levels
   *          items:
   *            properties:
   *              _id:
   *                type: string
   *                example: "348"
   *              avgBand:
   *                type: string
   *                example: 0.333333
   *    ObjectResponseCrowdlevelsNoFilters:
   *      properties:
   *        status:
   *          type: string
   *          description: OK or ERROR
   *          example: "OK"
   *        count:
   *          type: integer
   *          description: Number of filtered records
   *          example: 1
   *        results:
   *          type: array
   *          description: array of crowd levels
   *          items:
   *            properties:
   *              _id:
   *                type: string
   *                example: "348"
   *              latestBand:
   *                type: string
   *                example: -2
   */

  /**
   * @swagger
   * /api/crowdlevels:
   *    get:
   *      tags:
   *        - "Base"
   *      security:
   *        - bearerAuth: []
   *      description: |
   *        ## Description
   *        * Get facilities crowd level, if no start and end date specified (maximum or 7 days duration), return latest band (within last 7 days)
   *        * Band values are as follows: -2=closed, -1=no data, 0=not crowded, 1=some, 2=crowded, 3=max
   *        * Only get/compute values for band 0 - 3
   *      parameters:
   *        - in: query
   *          name: startDate
   *          schema:
   *            type: string
   *          description: start date in ISO String format
   *        - in: query
   *          name: endDate
   *          schema:
   *            type: string
   *          description: end date in ISO String format
   *      responses:
   *        '200':
   *          description: an array of crowd level information
   *          content:
   *            application/json:
   *              schema:
   *                oneOf:
   *                  - $ref: '#/definitions/ObjectResponseCrowdlevels'
   *                  - $ref: '#/definitions/ObjectResponseCrowdlevelsNoFilters'
   *              examples:
   *                foo:
   *                  value:
   *                    {
   *                    "versions": [
   *                        {
   *                            "status": "OK",
   *                            "count": 1,
   *                            "results": [
   *                                {
   *                                    "spaceoutId": "348",
   *                                    "avgBand": 0.3333
   *                                }
   *                            ]
   *                        }
   *                    ]
   *                    }
   *        default:
   *          description: Unexpected error
   */
  .get('/crowdlevels', authUser, getCrowdlevels)
