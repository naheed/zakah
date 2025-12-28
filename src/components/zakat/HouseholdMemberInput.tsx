import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Users, UserCircle } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface HouseholdMember {
  id: string;
  name: string;
  relationship: 'self' | 'spouse' | 'child' | 'other';
}

interface HouseholdMemberInputProps {
  members: HouseholdMember[];
  onMembersChange: (members: HouseholdMember[]) => void;
  className?: string;
}

const relationshipLabels: Record<HouseholdMember['relationship'], string> = {
  self: 'Self',
  spouse: 'Spouse',
  child: 'Child',
  other: 'Other',
};

const relationshipColors: Record<HouseholdMember['relationship'], string> = {
  self: 'bg-primary/10 text-primary border-primary/20',
  spouse: 'bg-secondary/10 text-secondary-foreground border-secondary/20',
  child: 'bg-tertiary/10 text-tertiary border-tertiary/20',
  other: 'bg-muted text-muted-foreground border-border',
};

export function HouseholdMemberInput({
  members,
  onMembersChange,
  className,
}: HouseholdMemberInputProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRelationship, setNewRelationship] = useState<HouseholdMember['relationship']>('child');

  const handleAddMember = () => {
    if (!newName.trim()) return;
    
    const newMember: HouseholdMember = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      relationship: newRelationship,
    };
    
    onMembersChange([...members, newMember]);
    setNewName("");
    setNewRelationship('child');
    setIsAdding(false);
  };

  const handleRemoveMember = (id: string) => {
    // Don't allow removing self
    const member = members.find(m => m.id === id);
    if (member?.relationship === 'self') return;
    
    onMembersChange(members.filter(m => m.id !== id));
  };

  // Initialize with self if empty
  if (members.length === 0) {
    onMembersChange([{
      id: 'self',
      name: 'You',
      relationship: 'self',
    }]);
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="w-4 h-4" weight="bold" />
        <span>Household Members</span>
      </div>

      {/* Member List */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {members.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              layout
            >
              <Badge 
                variant="outline" 
                className={cn(
                  "gap-1.5 py-1.5 px-3 text-sm",
                  relationshipColors[member.relationship]
                )}
              >
                <UserCircle className="w-4 h-4" weight="fill" />
                <span>{member.name}</span>
                <span className="text-xs opacity-70">({relationshipLabels[member.relationship]})</span>
                {member.relationship !== 'self' && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="ml-1 hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" weight="bold" />
                  </button>
                )}
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Member Form */}
      <AnimatePresence>
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row gap-2 p-3 bg-muted/50 rounded-lg">
              <Input
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 min-h-12"
                onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
              />
              <Select value={newRelationship} onValueChange={(v) => setNewRelationship(v as HouseholdMember['relationship'])}>
                <SelectTrigger className="w-full sm:w-32 min-h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddMember} 
                  disabled={!newName.trim()}
                  className="flex-1 sm:flex-initial min-h-12"
                >
                  Add
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsAdding(false)}
                  className="min-h-12"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAdding(true)}
              className="gap-1.5 min-h-12"
            >
              <Plus className="w-4 h-4" weight="bold" />
              Add family member
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <p className="text-xs text-muted-foreground">
        Track which assets belong to which household members for better organization.
      </p>
    </div>
  );
}
