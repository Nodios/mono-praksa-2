﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GeoEvents.Common;
using GeoEvents.Model.Common;

namespace GeoEvents.Repository.Common
{
    public interface ILocationRepository
    {

        /// <summary>
        /// Getslocation or creates if there is non  asynchronous.
        /// </summary>
        /// <param name="address"></param>
        /// <returns>
        /// Location
        /// </returns>
        Task<ILocation> GetLocationAsync(string address);

        /// <summary>
        /// Create Location asynchronous
        /// </summary>
        /// <param name="location"></param>
        /// <returns>
        /// Location
        /// </returns>
        Task<ILocation> CreateLocationAsync(ILocation location);

        /// <summary>
        /// Get Location by Id
        /// </summary>
        /// <param name="id"></param>
        /// <param name="Rating"></param>
        /// <returns>
        /// Location
        /// </returns>
        Task<ILocation> GetLocationByIdAsync(Guid id);

        /// <summary>
        /// Get Location by Id
        /// </summary>
        /// <param name="id"></param>
        /// <param name="Rating"></param>
        /// <returns>
        /// Location
        /// </returns>
        Task<ILocation> UpdateLocationRatingAsync(Guid id, double Rating);
       
    }
}
