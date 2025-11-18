using System.ComponentModel;
using System.Reflection;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Zenabackend.Common;

public static class CommonHelper
{
    public static string GetEnumDescription(Enum enumValue)
    {
        return enumValue.GetType()
            .GetMember(enumValue.ToString())
            .First()
            .GetCustomAttribute<DescriptionAttribute>()?.Description ?? enumValue.ToString();
    }

    public static List<SelectListItem> GetEnumList<T>() where T : Enum
    {
        return Enum.GetValues(typeof(T))
            .Cast<T>()
            .Select(e => new SelectListItem { Value = e.ToString(), Text = GetEnumDescription(e) })
            .ToList();
    }
}