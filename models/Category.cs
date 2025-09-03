using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace models
{
    public class Category
    {

        public class Rootobject
        {
            public Class1[] Property1 { get; set; }
        }

        public class Class1
        {
            public int id { get; set; }
            public string name { get; set; }
            public string slug { get; set; }
            public string image { get; set; }
            public DateTime creationAt { get; set; }
            public DateTime updatedAt { get; set; }
        }
    }
}
