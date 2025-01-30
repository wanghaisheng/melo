import bpy

TRANSFER_ZONES_COLLECTION_NAME = "DoorMesh"


class VIEW3D_PT_transfer_zones_panel(bpy.types.Panel):
    bl_label = "Transfer Zones"
    bl_idname = "VIEW3D_PT_transfer_zones_panel"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "Transfer Zones"

    def draw(self, context):
        layout = self.layout
        layout.operator(ReplaceTargetWithPositionOperator.bl_idname)
        layout.operator(AddMissingCustomPropsOperator.bl_idname)


def register():
    bpy.utils.register_class(VIEW3D_PT_transfer_zones_panel)


def unregister():
    bpy.utils.unregister_class(VIEW3D_PT_transfer_zones_panel)


class AddMissingCustomPropsOperator(bpy.types.Operator):
    """
    If the object is missing the required properties:
        - is_to_public: bool
        - zone_name: string
        - zone_target: object
    then add them to the object
    """

    bl_idname = "transfer_zones.add_custom_properties"
    bl_label = "Add Missing Props to Transfer Zones"

    def execute(self, context):
        add_custom_properties_to_missing_objects()
        return {"FINISHED"}


class ReplaceTargetWithPositionOperator(bpy.types.Operator):
    bl_idname = "transfer_zones.update_positions"
    bl_label = "Calculate position on properties"

    def execute(self, context):
        replace_zone_target_prop_with_target_position()
        return {"FINISHED"}


if __name__ == "__main__":
    bpy.utils.register_class(ReplaceTargetWithPositionOperator)
    bpy.utils.register_class(AddMissingCustomPropsOperator)
    register()

##################################################
############## FUNCTION DEFINITION ################
##################################################


def replace_zone_target_prop_with_target_position():
    door_collection = bpy.data.collections.get(TRANSFER_ZONES_COLLECTION_NAME)
    if not door_collection:
        print(f"Error: {TRANSFER_ZONES_COLLECTION_NAME} collection not found")
        return

    for obj in door_collection.objects:
        try:
            if "zone_target" in obj.keys():
                target_obj = obj["zone_target"]

                if isinstance(target_obj, bpy.types.Object):
                    target_position = target_obj.location.copy()

                    obj["target_pos_x"] = target_position.x
                    obj["target_pos_y"] = target_position.y
                    obj["target_pos_z"] = target_position.z
                    obj["target_zone_name"] = target_obj["zone_name"]
                    obj["target_zone_identifier"] = target_obj["zone_identifier"]
                else:
                    print(
                        f"Warning: target_pos for {obj.name} is not an object reference"
                    )
        except Exception as e:
            print(f"Error processing {obj.name}: {str(e)}")


def add_custom_properties_to_missing_objects():
    print("Starting to add custom properties...")

    door_collection = bpy.data.collections.get(TRANSFER_ZONES_COLLECTION_NAME)
    if not door_collection:
        print(f"Error: {TRANSFER_ZONES_COLLECTION_NAME} collection not found")
        return

    for obj in door_collection.objects:
        print(f"Processing object: {obj.name}")

        if "is_to_public" not in obj.keys():
            obj["is_to_public"] = False
            print(f"Added is_to_public to {obj.name}")

        if "zone_name" not in obj.keys():
            obj["zone_name"] = ""
            print(f"Added zone_name to {obj.name}")

        if "zone_identifier"  not in obj.keys():
            obj["zone_identifier"] = ""
            print(f"Added zone_identifier to {obj.name}")

        if "zone_target" not in obj.keys():
            obj["zone_target"] = None
            # Set up property UI for Object data-block
            print(f"Added zone_target to {obj.name}")
