﻿using System;
using System.Collections.Generic;

namespace GeoEvents.Model.Common
{
    public interface IEvent
    {
        #region Properties

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        string Name { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        string Description { get; set; }

        /// <summary>
        /// Gets or sets the lat.
        /// </summary>
        /// <value>
        /// The lat.
        /// </value>
        double Latitude { get; set; }

        /// <summary>
        /// Gets or sets the long.
        /// </summary>
        /// <value>
        /// The long.
        /// </value>
        double Longitude { get; set; }

        /// <summary>
        /// Gets or sets the categories.
        /// </summary>
        /// <value>
        /// The categories.
        /// </value>
        List<int> Categories { get; set; }

        /// <summary>
        /// Gets or sets the start time.
        /// </summary>
        /// <value>
        /// The start time.
        /// </value>
        DateTime StartTime { get; set; }

        /// <summary>
        /// Gets or sets the end time.
        /// </summary>
        /// <value>
        /// The end time.
        /// </value>
        DateTime EndTime { get; set; }

        /// <summary>
        /// Gets or sets the category.
        /// </summary>
        /// <value>
        /// The category.
        /// </value>
        int Category { get; set; }

        /// <summary>
        /// Gets or sets the price.
        /// </summary>
        /// <value>
        /// The price.
        /// </value>
        double Price { get; set; }

        /// <summary>
        /// Gets or sets the capacity.
        /// </summary>
        /// <value>
        /// The capacity.
        /// </value>
        int Capacity { get; set; }

        /// <summary>
        /// Gets or sets the reserved.
        /// </summary>
        /// <value>
        /// The reserved.
        /// </value>
        int Reserved { get; set; }

        /// <summary>
        /// Gets or sets the rating.
        /// </summary>
        /// <value>
        /// The rating.
        /// </value>
        double Rating { get; set; }

        /// <summary>
        /// Gets or sets the rate count.
        /// </summary>
        /// <value>
        /// The rate count.
        /// </value>
        int RateCount { get; set; }

        /// <summary>
        /// Gets or sets the location identifier.
        /// </summary>
        /// <value>
        /// The location identifier.
        /// </value>
        Guid LocationId { get; set; }

        /// <summary>
        /// Gets or sets the json string representing custom attributes
        /// </summary>
        /// <value>
        /// The string.
        /// </value>
        string Custom { get; set; }

        /// <summary>
        /// Gets or sets the occurrence.
        /// </summary>
        /// <value>
        /// The occurrence.
        /// </value>
        string Occurrence { get; set; }

        /// <summary>
        /// Gets or sets the repeat every.
        /// </summary>
        /// <value>
        /// The repeat every.
        /// </value>
        int RepeatEvery { get; set; }

        /// <summary>
        /// Gets or sets the repeat on.
        /// </summary>
        /// <value>
        /// The repeat on.
        /// </value>
        int RepeatOn { get; set; }

        /// <summary>
        /// Gets or sets the repeat count.
        /// </summary>
        /// <value>
        /// The repeat count.
        /// </value>
        int RepeatCount { get; set; }

        /// <summary>
        /// Gets or sets the repeat on list.
        /// </summary>
        /// <value>
        /// The repeat on list.
        /// </value>
        List<int> RepeatOnList { get; set; }

        #endregion Properties
    }
}