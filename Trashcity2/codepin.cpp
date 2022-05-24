//MD_Trashcity2::BE_Truck::RuleContext<MD_Trashcity2::ENV_QuartierRuleView> truckRuleContext (GetContext(), GetEnvironmentRuleView());

RuleContext<EnvironmentType::RuleViewType>  ruleContext( GetModel<ProcessContext::ModelRuleViewType::ModelType>(), GetEnvironmentRuleView());

csmForEachTypedSubEntity(BE_Truck, truck){
    truck->R_PickupTrash(ruleContext);
}

csmForEachTypedSubEntity(BE_Inhabitant, inhab){
    inhab->Perceive(ruleContext);
}
csmForEachTypedSubEntity(BE_Inhabitant, inhab){
    inhab->React(ruleContext);
}