import { Colors } from "@/constant/color"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Tabs } from "expo-router"

export default function TabLayout(): React.JSX.Element {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tabIconSelected,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderRadius: 30,
          marginHorizontal: 10,
          marginBottom: 10,
          paddingTop: 10,
          height: 70,
          position: "absolute",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name='home' color={color} />
          ),
          animation: "shift",
        }}
      />
      <Tabs.Screen
        name='devices'
        options={{
          headerShown: false,
          title: "Devices",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name='th-large' color={color} />
          ),
          animation: "shift",
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          headerShown: false,
          title: "Settings Rules",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name='cog' color={color} />
          ),
          animation: "shift",
        }}
      />
    </Tabs>
  )
}
