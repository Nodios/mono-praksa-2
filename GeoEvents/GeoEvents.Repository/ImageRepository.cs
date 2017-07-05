﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GeoEvents.Repository.Common;
using GeoEvents.DAL;
using Npgsql;

namespace GeoEvents.Repository
{
    public class ImageRepository : IImageRepository
    {
        bool Flag = false;
        PostgresConnection PostgresConn;
        public ImageRepository()
        {
            PostgresConn = new PostgresConnection();
        }


        public bool CreateImages(Guid eventId, List<IImageEntity> img)
        {
            PostgresConn.OpenConnection();

            NpgsqlCommand command = PostgresConn.NpgComm();
            foreach (var item in img)
            {
                command = new NpgsqlCommand
                    ("insert into \"Images\" values(@Id, @Content, @EventId)",
                    PostgresConn.NpgConn());

                command.Parameters.AddWithValue("@Id", item.Id);
                command.Parameters.AddWithValue("@Content", item.Content);
                command.Parameters.AddWithValue("@EventId", eventId);
            }

            if (command.ExecuteNonQuery() == 1)
            {
                Flag = true;
            }

            PostgresConn.CloseConnection();

            return Flag;
        }


        public List<IImageEntity> GetImages(Guid eventID)
        {
            PostgresConn.OpenConnection();

            NpgsqlCommand command = new NpgsqlCommand
                ("SELECT * FROM \"Images\" WHERE @eventID EQUALS \"EventId\"", 
                PostgresConn.NpgConn());
            command.Parameters.AddWithValue("@eventID", eventID);

            NpgsqlDataReader dr = command.ExecuteReader();

         
            List<IImageEntity> selectImages = new List<IImageEntity>();

            while (dr.Read())
            {
                ImageEntity tmp = new ImageEntity();
                long size = dr.GetBytes(0, 0, tmp.Content, 0,4096);  
                    
                tmp = new ImageEntity(new Guid(dr[0].ToString()), eventID );

                selectImages.Add(tmp);
            }

            return selectImages;
        }


    }
}